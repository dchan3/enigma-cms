import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

var isNotEmptyValue = (value) => value !== undefined && value !== null &&
  typeof value === 'object' && Object.keys(value).length > 0;

var FormBackground = styled.form`
  background-color: cadetblue;
  width: fit-content;
  margin: auto;
`;

var FormDiv = styled.div`
  padding: 8px;
`;

var FormInput = styled.input`
  border-radius: 8px;
  vertical-align: top;
  height: 16px;
  margin-top: 5px;
  font-family: sans-serif;
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
`;

var FormEnumInput = styled.select`

`;

var FormObjectInputLabel = styled.p`
  color: white;
  padding-right: 4px;
  font-family: sans-serif;
  text-transform: uppercase;
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
`;

class GeneratedForm extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    params: PropTypes.objectOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      shape: PropTypes.object,
      value: PropTypes.string,
      enumList: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        text: PropTypes.string
      }))
    })).isRequired,
    method: PropTypes.string.isRequired,
    formAction: PropTypes.string.isRequired,
    parentCallback: PropTypes.func
  }

  static defaultProps = {
    parentCallback: undefined
  }

  constructor(props) {
    super(props);
    var values = {};
    for (var n in this.props.params) {
      values[n] = this.props.params[n].value ||
        (this.props.params[n].type === '[object]' ? [] : '');
    }
    this.state = {
      values: values
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleArrayRemove = this.handleArrayRemove.bind(this);
    this.handleArrayAdd = this.handleArrayAdd.bind(this);
  }

  handleChange(param) {
    var self = this;
    return function(event) {
      event.preventDefault();
      var newState = {
          values: self.state.values
        }, match = '', varname = '', index = '', key = '';
      if (param.match(/^(.+)\[(\d+)]\.(.+)$/)) {
        match = param.match(/^(.+)\[(\d+)]\.(.+)$/);
        varname = match[1];
        index = parseInt(match[2]);
        key = match[3];
        newState.values[varname][index] =
          isNotEmptyValue(newState.values[varname][index]) ?
            newState.values[varname][index] : {};
        newState.values[varname][index][key] = event.target.value;
      }
      else if (param.match(/^([^[]]+)\.(.+)$/)) {
        match = param.match(/^(.+)\.(.+)$/);
        varname = match[1];
        key = match[2];
        newState.values[varname] =
          isNotEmptyValue(newState.values[varname]) ?
            newState.values[varname] : {};
        newState.values[varname][key] = event.target.value;
      }
      else if (param.match(/^(.+)\[(\d)\]$/)) {
        match = param.match(/\[(\d)\]/);
        varname = match[1];
        index = parseInt(match[2]);
        newState.values[varname] = isNotEmptyValue(newState.values[varname]) ?
          newState.values[varname] : [];
        newState.values[varname][index] = event.target.value;
      }
      else { newState.values[param] = event.target.value; }
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
        }, toAdd = {};
      if (self.props.params[param].type === '[object]') {
        for (var key in self.props.params[param].shape) {
          toAdd[key] = '';
        }
      }
      else toAdd = '';
      newState.values[param].push(toAdd);
      self.setState(newState);
    }
  }

  render() {
    var params = this.props.params, values = this.state.values,
      handleChange = this.handleChange,
      handleArrayRemove = this.handleArrayRemove,
      handleArrayAdd = this.handleArrayAdd;

    return (
      <div>
        <FormHeader>{this.props.title}</FormHeader>
        {window.location.search &&
          window.location.search.startsWith('?error=') ?
          <FormErrorMessage>
            {decodeURIComponent(window.location.search.replace('?error=', ''))}
          </FormErrorMessage> : null}
        <FormBackground action={this.props.formAction}
          method={this.props.method}>
          {Object.keys(params).map((param, i) => {
            return <FormDiv key={param + i.toString()}>
              {!params[param].type.match(/\[.*\]/) ?
                (params[param].type !== 'object' ? (
                  params[param].type !== 'enum' ? [
                    <FormLabel htmlFor={param}>
                      {params[param].label}</FormLabel>,
                    <br />,
                    <FormInput id={param} name={param}
                      type={params[param].type} value={values[param]}
                      onChange={(e) => handleChange(param)(e)} />
                  ] :
                    [
                      <FormLabel htmlFor={param}>
                        {params[param].label}</FormLabel>,
                      <br />,
                      <FormEnumInput id={param} name={param}
                        value={values[param]} onChange={(e) => {
                          handleChange(param)(e); }}>
                        {params[param].enumList.map(
                          (node) => {
                            return <option value={node.value}>
                              {node.text}</option>;
                          }
                        )}
                      </FormEnumInput>
                    ]) : <div>
                  <FormObjectInputLabel>{params[param].label}
                  </FormObjectInputLabel>
                  {Object.keys(params[param].shape).map((key) =>
                    (params[param].shape[key].type !== 'enum') ? <FormDiv>
                      <FormLabel htmlFor={param + '.' + key}>
                        {params[param].shape[key].label}</FormLabel>
                      <br />
                      <FormInput id={param + '.' + key}
                        name={param + '.' + key}
                        type={params[param].shape[key].type}
                        value={values[param][key]}
                        onChange={(e) =>
                          handleChange(param + '.' + key)(e)} />
                    </FormDiv> : <FormDiv>
                      <FormLabel htmlFor={param + '.' + key}>
                        {params[param].shape[key].label}</FormLabel>
                      <FormEnumInput id={param + '.' + key}
                        name={param + '.' + key} onChange={(e) => {
                          handleChange(param + '.' + key)(e)
                        }}
                        value={params[param].shape[key].value}>
                        {params[param].shape[key].enumList.map(
                          (node) => {
                            return <option value={node.value}>
                              {node.text}</option>;
                          }
                        )}
                      </FormEnumInput>
                    </FormDiv>
                  )}
                </div>) : (params[param].type !== '[object]' ?
                  [
                    <FormObjectInputLabel>{params[param].label}
                    </FormObjectInputLabel>,
                    <button onClick={handleArrayAdd(param)}>Add</button>,
                    <FormLabel htmlFor={param + '_0'}>
                      {params[param].label + ' 1'}</FormLabel>,
                    <br />,
                    <FormInput id={param + '_0'} name={param + '.0'}
                      value={values[param][0]}
                      onChange={(e) => { handleChange(param + '.0')(e); }} />,
                    <button onClick={(e) =>
                      handleArrayRemove(param, 0)(e)}>{'Remove'}</button>,
                    values[param].length > 0 ?
                      values[param].slice(1).map((node, i) => [
                        <FormLabel htmlFor={param + '_' + (i + 1).toString()}>
                          {params[param].label + ' ' + (i + 2)}</FormLabel>,
                        <FormInput id={param + '_' + (i + 1).toString()}
                          name={param + '.' + (i + 1).toString()}
                          value={values[param][i + 1]}
                          onChange={(e) => handleChange(param + '[' +
                          (i + 1).toString() + ']')(e)} />,
                        <button onClick={(e) =>
                          handleArrayRemove(param, i + 1)(e)}>
                          {'Remove'}</button>])
                      : null
                  ] : [
                    <div>
                      <FormObjectInputLabel>{params[param].label}
                      </FormObjectInputLabel>
                      <button onClick={handleArrayAdd(param)}>Add</button>
                      <FormObjectInputLabel>{params[param].label + ' 1'}
                      </FormObjectInputLabel>
                      {Object.keys(params[param].shape).map((key) =>
                        (params[param].shape[key].type !== 'enum') ?
                          <FormDiv>
                            <FormLabel htmlFor={param + '.0.' + key}>
                              {params[param].shape[key].label}</FormLabel>
                            <br />
                            <FormInput id={param + '.0.' + key}
                              name={param + '.0.' + key}
                              type={params[param].shape[key].type}
                              value={values[param] && values[param][0] &&
                                values[param][0][key] || ''}
                              onChange={(e) =>
                                handleChange(param + '[0].' + key)(e)} />
                          </FormDiv> : <FormDiv>
                            <FormLabel
                              htmlFor={param + '.0.' + key}>
                              {params[param].shape[key].label}</FormLabel>
                            <br />
                            <FormEnumInput id={param + '.0.' + key}
                              name={param + '.0.' + key} onChange={(e) => {
                                handleChange(param + '.0.' + key)(e)
                              }}>
                              {params[param].shape[key].enumList.map(
                                (node) => {
                                  return <option value={node.value}>
                                    {node.text}</option>;
                                }
                              )}
                            </FormEnumInput>
                          </FormDiv>
                      )}
                      <button
                        onClick={(e) => handleArrayRemove(param, 0)(e)}>
                        {'Remove'}</button>
                    </div>,
                    values[param].length > 0 ?
                      values[param].slice(1).map((node, i) => <div>
                        <FormObjectInputLabel>
                          {params[param].label + ' ' + (i + 2)}
                        </FormObjectInputLabel>
                        {Object.keys(params[param].shape).map((key) =>
                          (params[param].shape[key].type !== 'enum') ?
                            <FormDiv>
                              <FormLabel
                                htmlFor={param + '.' + (i + 1) + '.' + key}>
                                {params[param].shape[key].label}</FormLabel>
                              <br />
                              <FormInput id={param + '.' + (i + 1) + '.' + key}
                                name={param + '.' + (i + 1) + '.' + key}
                                type={params[param].shape[key].type}
                                value={values[param][i + 1][key] || ''}
                                onChange={(e) =>
                                  handleChange(
                                    param + '[' + (i + 1) + '].' + key)(e)} />
                            </FormDiv> : <FormDiv>
                              <FormLabel
                                htmlFor={param + '.' + (i + 1) + '.' + key}>
                                {params[param].shape[key].label}</FormLabel>
                              <br />
                              <FormEnumInput
                                id={param + '.' + (i + 1) + '.' + key}
                                name={param + '.' + (i + 1)+ '.' + key}>
                                {params[param].shape[key].enumList.map(
                                  (node) => {
                                    return <option value={node.value}>
                                      {node.text}</option>;
                                  }
                                )}
                              </FormEnumInput>
                            </FormDiv>
                        )}
                        <button
                          onClick={(e) => handleArrayRemove(param, i + 1)(e)}>
                          {'Remove'}</button>
                      </div>) : null])}
            </FormDiv>;
          })}
          <FormSubmit type="submit" value="Submit" />
        </FormBackground>
      </div>
    );
  }
}

export default GeneratedForm;
