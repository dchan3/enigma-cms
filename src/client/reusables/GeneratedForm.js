import { h } from 'preact'; /** @jsx h **/
import { useContext } from 'preact/hooks';
import GeneratedFormContext, { GeneratedFormContextProvider } from './GeneratedFormContext';
import { loget, loset } from '../../lib/utils/lofuncs';
import { getRequest, postRequest } from '../utils/api_request_async';
import { default as gensig } from '../../lib/utils/gensig';
import { default as formGenUtils } from '../utils/form_from_obj';
import { default as comps, FormContainer, FormHeader, FormErrorMessage,
  FormBackground, FormDiv, FormSubmit } from './formComps';

function GeneratedFormContents() {
  let { state, setState, params, parentCallback, method, formAction,
    successCallback, redirectUrl, title, fileContent
  } = useContext(GeneratedFormContext);

  function readFile(file) {
    let rdr = new FileReader();
    return new Promise((resolve, reject) => {
      rdr.onload = ({ target: { result } }) => resolve(result);
      rdr.onerror = (error) => reject(error);
      rdr.readAsDataURL(file);
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
        let [fileStuff] = files,
          sixfour = await readFile(fileStuff);
        sixfour = sixfour.replace(/^data:.+;base64,/, '');
        loset(newState.values, fileContent, sixfour);
      }

      setState(newState);

      if (parentCallback !== undefined) parentCallback(newState.values);
    };
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
        getRequest(formAction, cbFunc, config) :
        postRequest(formAction, JSON.stringify({
          ...requestBody, sig }), cbFunc, config);
    }
    else {
      setState({
        errorMessage: `Fields missing: ${valid.join(', ')}.`,
        invalidFields: valid,
        values: state.values });
    }
  }

  let selfFuncs = { handleArrayAdd, handleArrayRemove, handleChange };

  return <FormContainer>
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
                {children.map(({ component: c, attributes, innerText }) => {
                  let ChildComponent = comps[c];
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
  </FormContainer>;
}

export default function GeneratedForm({
  parentCallback = undefined, fileContent = 'fileContent', method = 'post',
  ...rest
}) {
  return <GeneratedFormContextProvider {...{
    parentCallback, fileContent, method
  }} {...rest}>
    <GeneratedFormContents />
  </GeneratedFormContextProvider>;
}
