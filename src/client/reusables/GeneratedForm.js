import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CodeEditor from './CodeEditor';
import { get as loget, set as loset, concat as loconcat } from 'lodash';
import { get as axget, post as axpost } from 'axios';
import { default as gensig } from '../../lib/utils/gensig';
import { default as formGenUtils } from '../utils/form_from_obj';

var FormBackground = styled.form`
  background-color: cadetblue;
  width: fit-content;
  margin: auto;
  text-align: left;
`;

var FormDiv = styled.div`
  padding: 8px;
  display: ${props => props.hidden ? 'none' : 'block'}
`;

var FormInput = styled.input`
  border-radius: 8px;
  vertical-align: top;
  height: 16px;
  margin-top: 5px;
  font-family: sans-serif;
  font-size: 16px;
  padding: 5px;
  display: ${props => props.hidden ? 'none' : 'block'}
`;

var FormHeader = styled.h2`
  text-align: center;
  font-family: sans-serif;
`;

var FormLabel = styled.label`
  color: white;
  padding-right: 4px;
  font-family: sans-serif;
  text-transform: uppercase;
  display: ${props => props.hidden ? 'none' : 'block'}
`;

var FormEnumInput = styled.select`
  font-family: sans-serif;
  font-size: 16px;
`;

var FormEnumInputOption = styled.option`
  font-family: sans-serif;
  font-size: 16px;
`;

var FormObjectInputLabel = styled.p`
  color: white;
  padding-right: 4px;
  font-family: sans-serif;
  text-transform: uppercase;
  margin: 8px;
  display: ${props => props.hidden ? 'none' : 'block'}
`;

var FormSubmit = styled.input`
  font-family: sans-serif;
  text-transform: uppercase;
  margin: 8px;
  border-radius: 8px;
  font-size: 14px;
`;

var FormErrorMessage = styled.p`
  font-family: sans-serif;
  text-transform: uppercase;
  text-align: center;
`;

var FormSubmitButton = styled.button`
  font-size: 16px;
  font-family: sans-serif;
  text-transform: uppercase;
  padding: 8px;
  border-radius: 8px;
  margin: 8px;
`;

var comps = {
  FormInput, FormLabel, CodeEditor, FormSubmitButton,
  FormEnumInput, FormEnumInputOption, FormObjectInputLabel
};

class GeneratedForm extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    params: PropTypes.objectOf(PropTypes.shape({
      label: PropTypes.string,
      type: PropTypes.oneOfType(
        [PropTypes.string, PropTypes.func]).isRequired,
      grammar: PropTypes.string,
      shape: PropTypes.oneOfType(
        [PropTypes.object, PropTypes.func]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.object,
        PropTypes.array]),
      enumList: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string
      })), PropTypes.func]),
      maximum: PropTypes.number,
      minimum: PropTypes.number
    })).isRequired,
    successCallback: PropTypes.func,
    method: PropTypes.string.isRequired,
    formAction: PropTypes.string.isRequired,
    parentCallback: PropTypes.func,
    fileContent: PropTypes.string,
    redirectUrl: PropTypes.string
  };

  static defaultProps = {
    parentCallback: undefined,
    fileContent: 'fileContent',
    method: 'post'
  };

  constructor(props) {
    super(props);
    let values = {};
    for (let n in this.props.params) {
      loset(values, n, loget(this.props.params, n).value);
    }
    this.state = {
      values: values,
      errorMessage: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleArrayRemove = this.handleArrayRemove.bind(this);
    this.handleArrayAdd = this.handleArrayAdd.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  readFile(file) {
    let rdr = new FileReader();
    return new Promise((resolve, reject) => {
      rdr.onload = event => resolve(event.target.result);
      rdr.onerror = error => reject(error);
      rdr.readAsArrayBuffer(file);
    });
  }

  handleChange(param) {
    var self = this;
    return async function(event) {
      event.preventDefault();
      var newState = {
        values: self.state.values
      };

      loset(newState.values, param, event.target.value);

      if (event.target.type === 'file') {
        var contents = await self.readFile(event.target.files[0]);
        var sixfour = Buffer.from(contents).toString('base64');
        loset(newState.values, self.props.fileContent, sixfour);
      }

      self.setState(newState);
      if (self.props.parentCallback !== undefined)
        self.props.parentCallback(newState.values);
    }
  }

  handleArrayRemove(param, n) {
    var self = this;
    return function(event) {
      event.preventDefault();
      var newState = {
        values: self.state.values
      };
      newState.values[param].splice(n, 1);
      self.setState(newState);
    }
  }

  handleArrayAdd(param) {
    var self = this;
    return function(event) {
      event.preventDefault();
      var newState = {
          values: self.state.values
        }, toAdd = {}, actualParam = param.replace(/.\d./g, '.shape.');
      if (loget(self.props.params, actualParam).type === '[object]') {
        for (var key in loget(self.props.params, actualParam).shape) {
          toAdd[key] = '';
        }
      }
      else toAdd = '';
      loset(newState.values, param,
        loconcat(loget(newState.values, param), toAdd));
      self.setState(newState);
    }
  }

  handleSubmit(event) {
    let self = this, requestBody = {};
    Array.prototype.slice.call(
      event.target.parentElement.elements, 0 , -1).forEach(
      (node) => { requestBody[node.id] = node.value; });
    let sig = gensig(requestBody), config = {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    };
    (self.props.method.match('/^get$/i') ?
      axget(self.props.formAction, config) :
      axpost(self.props.formAction, {
        ...requestBody, sig: sig
      }, config)).then(function(response) {
      if (self.props.successCallback)
        self.props.successCallback(response);
      else if (self.props.redirectUrl)
        window.location.href = self.props.redirectUrl;
    }).catch(function (error) {
      self.setState({ errorMessage: error.message });
    });
  }

  render() {
    let params = this.props.params, self = this,
      selfFuncs = {
        handleArrayAdd: self.handleArrayAdd,
        handleArrayRemove: self.handleArrayRemove,
        handleChange: self.handleChange
      }

    return (
      <div>
        <FormHeader>{this.props.title}</FormHeader>
        {this.state.errorMessage ?
          <FormErrorMessage>
            {this.state.errorMessage}
          </FormErrorMessage> : null}
        <FormBackground onSubmit={(e) => e.preventDefault()}>
          {formGenUtils.formFromObj(params, this.state.values).map(
            function(node) {
              if (node) {
                var NodeComponent = comps[node.component],
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
                      var ChildComponent = comps[child.component];
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
            onClick={this.handleSubmit} />
        </FormBackground>
      </div>
    );
  }
}

export default GeneratedForm;
