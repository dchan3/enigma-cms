import React, { useState } from 'react';
import {
  string, shape, objectOf, oneOfType, func, object, array, arrayOf, number
} from 'prop-types';
import styled from 'styled-components';
import CodeEditor from './CodeEditor';
import { get as loget, set as loset, concat as loconcat } from 'lodash';
import { get as axget, post as axpost } from 'axios';
import { default as gensig } from '../../lib/utils/gensig';
import { default as formGenUtils } from '../utils/form_from_obj';

let FormBackground = styled.form`
  background-color: cadetblue;
  width: fit-content;
  margin: auto;
  text-align: left;
`, FormDiv = styled.div`
  padding: 8px;
  display: ${props => props.hidden ? 'none' : 'block'}
`, FormInput = styled.input`
  border-radius: 8px;
  vertical-align: top;
  height: 16px;
  margin-top: 5px;
  font-family: sans-serif;
  font-size: 16px;
  padding: 5px;
  display: ${({ hidden }) => hidden ? 'none' : 'block'}
`, FormHeader = styled.h2`
  text-align: center;
  font-family: sans-serif;
`, FormLabel = styled.label`
  color: white;
  padding-right: 4px;
  font-family: sans-serif;
  text-transform: uppercase;
  display: ${({ hidden }) => hidden ? 'none' : 'block'}
`, FormEnumInput = styled.select`
  font-family: sans-serif;
  font-size: 16px;
`, FormEnumInputOption = styled.option`
  font-family: sans-serif;
  font-size: 16px;
`, FormObjectInputLabel = styled.p`
  color: white;
  padding-right: 4px;
  font-family: sans-serif;
  text-transform: uppercase;
  margin: 8px;
  display: ${({ hidden }) => hidden ? 'none' : 'block'}
`, FormSubmit = styled.input`
  font-family: sans-serif;
  text-transform: uppercase;
  margin: 8px;
  border-radius: 8px;
  font-size: 14px;
`, FormErrorMessage = styled.p`
  font-family: sans-serif;
  text-transform: uppercase;
  text-align: center;
`, FormSubmitButton = styled.button`
  font-size: 16px;
  font-family: sans-serif;
  text-transform: uppercase;
  padding: 8px;
  border-radius: 8px;
  margin: 8px;
`, comps = {
    FormInput, FormLabel, CodeEditor, FormSubmitButton,
    FormEnumInput, FormEnumInputOption, FormObjectInputLabel
  };

function GeneratedForm({ params, parentCallback, method, formAction,
  successCallback, redirectUrl, title }) {
  let values = {};
  for (let n in params) {
    loset(values, n, loget(params, n).value);
  }
  let [state, setState] = useState({
    values: values,
    errorMessage: ''
  });


  function readFile(file) {
    let rdr = new FileReader();
    return new Promise((resolve, reject) => {
      rdr.onload = event => resolve(event.target.result);
      rdr.onerror = error => reject(error);
      rdr.readAsArrayBuffer(file);
    });
  }

  function handleChange(param) {
    return async function(event) {
      event.preventDefault();
      let newState = {
        values: state.values,
        errorMessage: ''
      };

      loset(newState.values, param, event.target.value);

      if (event.target.type === 'file') {
        let contents = await readFile(event.target.files[0]),
          sixfour = Buffer.from(contents).toString('base64');
        loset(newState.values, self.props.fileContent, sixfour);
      }

      setState(newState);

      if (parentCallback !== undefined) parentCallback(newState.values);
    }
  }

  function handleArrayRemove(param, n) {
    return function(event) {
      event.preventDefault();
      let newState = {
        values: state.values
      };
      newState.values[param].splice(n, 1);
      setState(newState);
    }
  }

  function handleArrayAdd(param) {
    return function(event) {
      event.preventDefault();
      let newState = {
          values: state.values
        }, toAdd = {}, actualParam = param.replace(/.\d./g, '.shape.');
      if (loget(params, actualParam).type === '[object]') {
        for (let key in loget(params, actualParam).shape) {
          toAdd[key] = '';
        }
      }
      else toAdd = '';
      loset(newState.values, param,
        loconcat(loget(newState.values, param), toAdd));
      setState(newState);
    }
  }

  function handleSubmit({ target }) {
    let requestBody = {};
    Array.prototype.slice.call(
      target.parentElement.elements, 0 , -1).forEach(
      (node) => { requestBody[node.id] = node.value; });
    let sig = gensig(requestBody), config = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    };
    (method.match('/^get$/i') ?
      axget(formAction, config) :
      axpost(formAction, {
        ...requestBody, sig: sig
      }, config)).then(function(response) {
      if (successCallback) successCallback(response);
      else if (redirectUrl)
        window.location.href = redirectUrl;
    }).catch(function (error) {
      setState({ errorMessage: error.message, value: state.value });
    });
  }

  let selfFuncs = { handleArrayAdd, handleArrayRemove, handleChange };

  return (
    <div>
      <FormHeader>{title}</FormHeader>
      {state.errorMessage ?
        <FormErrorMessage>
          {state.errorMessage}
        </FormErrorMessage> : null}
      <FormBackground onSubmit={(e) => e.preventDefault()}>
        {formGenUtils.formFromObj(params, state.values).map(
          function(node) {
            if (node) {
              let NodeComponent = comps[node.component],
                attrObj = Object.assign({}, node.attributes || {});

              if (attrObj.onChange) {
                let attrSplit = attrObj.onChange.split(' ');
                attrObj.onChange = (e) => {
                  selfFuncs[attrSplit[0]](...attrSplit.slice(1))(e);
                }
              }
              if (attrObj.onClick) {
                let attrSplit = attrObj.onClick.split(' ');
                attrObj.onClick = (e) => {
                  selfFuncs[attrSplit[0]](...attrSplit.slice(1))(e);
                }
              }

              if (node.innerText) {
                return <FormDiv><NodeComponent {...attrObj}>
                  {node.innerText}
                </NodeComponent></FormDiv>;
              } else if (node.children) {
                return <FormDiv><NodeComponent {...attrObj}>
                  {node.children.map(child => {
                    let ChildComponent = comps[child.component];
                    return <ChildComponent {...child.attributes}>
                      {child.innerText}
                    </ChildComponent>;
                  })}
                </NodeComponent></FormDiv>;
              }
              else return <FormDiv><NodeComponent {...attrObj} /></FormDiv>;
            }
            else return null;
          })
        }
        <FormSubmit type="submit" value="Submit"
          onClick={handleSubmit} />
      </FormBackground>
    </div>
  );
}

GeneratedForm.propTypes = {
  title: string.isRequired,
  params: objectOf(shape({
    label: string,
    type: oneOfType(
      [string, func]).isRequired,
    grammar: string,
    shape: oneOfType(
      [object, func]),
    value: oneOfType([string, object, array]),
    enumList: oneOfType([arrayOf(shape({
      value: string,
      text: string
    })), func]),
    maximum: number,
    minimum: number,
    attrDepends: object
  })).isRequired,
  successCallback: func,
  method: string.isRequired,
  formAction: string.isRequired,
  parentCallback: func,
  fileContent: string,
  redirectUrl: string
};

GeneratedForm.defaultProps =  {
  parentCallback: undefined,
  fileContent: 'fileContent',
  method: 'post'
};

export default GeneratedForm;
