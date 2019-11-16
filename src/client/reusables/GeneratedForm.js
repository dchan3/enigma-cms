import React, {  useState } from 'react';
import CodeEditor from './CodeEditor';
import { loget, loset } from '../utils/lofuncs';
import { default as requests } from '../utils/api_request_async';
import { default as gensig } from '../../lib/utils/gensig';
import { default as formGenUtils } from '../utils/form_from_obj';
import fromCss from '../utils/component_from_css';

let FormBackground = fromCss('form',
    'background-color:cadetblue;width:45%;margin:auto;text-align:left;'
  ), FormDiv = fromCss('div',
    ({ hidden }) => `padding:8px;display:${hidden ? 'none' : 'block'};`,
    ['hidden']),
  FormHeader = fromCss('h2', 'text-align:center;font-family:sans-serif;'),
  FormSubmit = fromCss('input', 'font-family:sans-serif;' +
  'text-transform:uppercase;margin:8px;border-radius:8px;font-size: 16px;'),
  FormErrorMessage = fromCss('p', 'font-family:sans-serif;' +
  'text-transform:uppercase;text-align:center;'), comps = {
    FormInput: fromCss('input', ({ hidden, isInvalid }) =>
      ('border-radius:8px;vertical-align:top;height:16px;' +
      'width:calc(100% - 16px);margin-top:5px;font-family:sans-serif;' +
      'font-size:16px;padding:5px;' + `display:${hidden ? 'none' :
        'block'};box-shadow:${isInvalid ?
        'red 2px 2px' : 'unset'};`), ['hidden', 'isInvalid']),
    FormLabel: fromCss('label', ({ hidden, isInvalid }) => (
      'color:white;font-size:16px;padding-right:4px;font-family:sans-serif;' +
      `text-transform:uppercase;display:${hidden ? 'none' : 'block'};` +
      `text-shadow:${isInvalid ? 'red 2px 2px' : 'unset'};`),
    ['hidden', 'isInvalid']), CodeEditor,
    FormSubmitButton: fromCss('button',
      'font-size:16px;font-family:sans-serif;text-transform:uppercase;' +
    'padding:8px;border-radius:8px;margin:8px;'),
    FormEnumInput: fromCss('select',
      'font-family:sans-serif;font-size:16px;', ['hidden', 'isInvalid']),
    FormEnumInputOption: fromCss('option',
      'font-family:sans-serif;font-size:16px;', ['hidden', 'isInvalid']),
    FormObjectInputLabel: fromCss('p', ({ hidden }) => `color:white;
  padding-right:4px;font-family:sans-serif;text-transform:uppercase;margin:8px;
  font-size:16px;width:calc(100% - 16px);display:${hidden ? 'none' : 'block'};`,
    ['hidden', 'isInvalid'])
  };

function GeneratedForm({ params, parentCallback, method, formAction,
  successCallback, redirectUrl, title, fileContent, currentValue }) {
  let values = {};
  if (currentValue) Object.assign(values, currentValue);
  for (let n in params) {
    let paramVal = loget(params, n);
    if (paramVal && paramVal.value) loset(values, n, paramVal.value);
  }
  let [state, setState] = useState({
    values, errorMessage: '', invalidFields: [] });

  function readFile(file) {
    let rdr = new FileReader();
    return new Promise((resolve, reject) => {
      rdr.onload = ({ target: { result } }) => resolve(result);
      rdr.onerror = error => reject(error);
      rdr.readAsArrayBuffer(file);
    });
  }

  function handleChange(param) {
    return async function(event) {
      let { type, value, files } = event.target;
      event.preventDefault();
      let newState = Object.assign({}, state);
      newState.errorMessage = '';
      loset(newState.values, param, value);

      if (type === 'file') {
        let [fileStuff] = files, contents = await readFile(fileStuff),
          sixfour = Buffer.from(contents).toString('base64');
        loset(newState.values, fileContent, sixfour);
      }

      setState(newState);

      if (parentCallback !== undefined) parentCallback(newState.values);
    }
  }

  function handleArrayRemove(param, n) {
    return function(event) {
      event.preventDefault();
      let newState = Object.assign({}, state), vals = newState.values[param];
      newState.errorMessage = '';
      vals.splice(n, 1);
      newState.values[param]= vals;
      setState(newState);
    }
  }

  function handleArrayAdd(param) {
    return function(event) {
      event.preventDefault();
      let newState = Object.assign({}, state), toAdd = {},
        actualParam = param.replace(/.\d./g, '.shape.'),
        { type: gotType, shape: gotShape } = loget(params, actualParam);
      if (!newState.values[param]) newState.values[param] = [];
      if (gotType === '[object]') {
        for (let key in gotShape) {
          toAdd[key] = '';
        }
      }
      else toAdd = '';
      newState.errorMessage = '';
      loset(newState.values, param,
        [...loget(newState.values, param), toAdd]);
      setState(newState);
    }
  }

  function handleSubmit({ target: { parentElement: { elements } } }) {
    let requestBody = {}, valid =
      formGenUtils.validateForm(params, state.values);
    if (valid === true) {
      Array.prototype.slice.call(elements, 0 , -1).forEach(
        ({ id, value }) => { requestBody[id] = value; });
      let sig = gensig(requestBody), config = {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        }, cbFunc = function(data) {
          if (successCallback) successCallback(data);
          else if (redirectUrl) window.location.href = redirectUrl;
        };
      method.match('/^get$/i') ?
        requests.getRequest(formAction, cbFunc, config) :
        requests.postRequest(formAction, JSON.stringify({
          ...requestBody, sig }), cbFunc, config);
    }
    else {
      setState({
        errorMessage: `Fields missing: ${valid.join(', ')}.`,
        invalidFields: valid,
        values: state.values })
    }
  }

  let selfFuncs = { handleArrayAdd, handleArrayRemove, handleChange };

  return <div style={{ width: '100%' }}>
    <FormHeader>{title}</FormHeader>
    {state.errorMessage ?
      <FormErrorMessage>{state.errorMessage}</FormErrorMessage> : null}
    <FormBackground noValidate={true} onSubmit={(e) => e.preventDefault()}>
      {formGenUtils.formFromObj(
        params, state.values, null, state.invalidFields).map(
        function(node) {
          if (node) {
            let { component, attributes, innerText, children } = node,
              NodeComponent = comps[component],
              attrObj = Object.assign({}, attributes || {}),
              attrSplit = '';

            if (attrObj.onChange) {
              attrSplit = attrObj.onChange.split(' ');
              attrObj.onChange = (e) => {
                selfFuncs[attrSplit[0]](...attrSplit.slice(1))(e);
              }
            }
            if (attrObj.onClick) {
              attrSplit = attrObj.onClick.split(' ');
              attrObj.onClick = (e) => {
                selfFuncs[attrSplit[0]](...attrSplit.slice(1))(e);
              }
            }

            if (innerText) {
              return <FormDiv><NodeComponent {...attrObj}>
                {innerText}
              </NodeComponent></FormDiv>;
            } else if (children) {
              return <FormDiv><NodeComponent {...attrObj}>
                {children.map(({ component, attributes, innerText }) => {
                  let ChildComponent = comps[component];
                  return <ChildComponent {...attributes}>
                    {innerText}
                  </ChildComponent>;
                })}
              </NodeComponent></FormDiv>;
            }
            else return <FormDiv><NodeComponent {...attrObj} /></FormDiv>;
          }
          else return null;
        })
      } <FormSubmit type="submit" value="Submit" onClick={handleSubmit} />
    </FormBackground>
  </div>;
}

GeneratedForm.defaultProps =  {
  parentCallback: undefined,
  fileContent: 'fileContent',
  method: 'post'
};

export default GeneratedForm;
