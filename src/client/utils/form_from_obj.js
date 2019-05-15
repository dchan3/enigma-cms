import _ from 'lodash';
import { default as camelcaseConvert } from './camelcase_convert';

const outputKeys = function(obj, includeParents, parent) {
  var retval = [];
  for (var key in obj) {
    if (typeof obj[key] === 'object') {
      if (includeParents) retval.push(parent ? `${parent}.${key}` : key);
      retval.push(
        ...outputKeys(obj[key],
          includeParents, parent ? `${parent}.${key}` : key));
    }
    else retval.push(parent ? `${parent}.${key}` : key);
  }
  return retval;
};

const mapKeysToValues = function(obj) {
  var keys = outputKeys(obj, false), retval = {};
  for (var key in keys) {
    retval[keys[key]] = _.get(obj, keys[key]);
  }
  return retval;
}

const typeVerify = function(typeVar, argsToPass) {
  return typeof typeVar === 'function' ? typeVar(...argsToPass) : typeVar;
}

const genInputComponent = function(paramSpec, valueVar, keyToUse) {
  if (typeVerify(paramSpec.type).match(/enum/)) {
    return {
      component: 'FormEnumInput',
      attributes: {
        id: keyToUse,
        name: keyToUse,
        onChange: `handleChange ${keyToUse}`,
        value: valueVar
      },
      children: paramSpec.enumList.map((option) => ({
        component: 'FormEnumInputOption',
        attributes: { value: option.value },
        innerText: option.text
      }))
    }
  }
  else if (typeVerify(paramSpec.type).match(/text/)) {
    if (paramSpec.grammar) {
      return {
        component: 'CodeEditor',
        attributes: {
          id: keyToUse,
          name: keyToUse,
          grammar: paramSpec.grammar,
          value: valueVar || ''
        }
      };
    }
    else if (paramSpec.maximum && paramSpec.maximum !== '') {
      return {
        component: 'FormInput',
        attributes: {
          id: keyToUse,
          name: keyToUse,
          type: 'text',
          maxLength: paramSpec.maximum,
          onChange: `handleChange ${keyToUse}`,
          value: valueVar
        }
      };
    }
    else return {
      component: 'FormInput',
      attributes: {
        id: keyToUse,
        name: keyToUse,
        type: 'text',
        onChange: `handleChange ${keyToUse}`,
        value: valueVar
      }
    };
  }
  else {
    var extraAttrs = Object.assign({}, paramSpec);
    delete extraAttrs.type;
    if (extraAttrs.label) delete extraAttrs.label;
    if (extraAttrs.value) delete extraAttrs.value;

    return {
      component: 'FormInput',
      attributes: {
        id: keyToUse,
        name: keyToUse,
        type: typeVerify(paramSpec.type).match(/[a-z]+/)[0],
        onChange: `handleChange ${keyToUse}`,
        value: valueVar,
        ...extraAttrs
      }
    }
  }
}

const formFromObj = function(paramsObj, valuesObj, extra) {
  var retval = [],
    realParamsObj = Object.assign({}, (extra && extra.parentKey) ?
      _.get(paramsObj,
        `${extra.parentKey
          .replace(/([a-z]+)\.([a-z]+)$/, '$1.shape.$2')
          .replace(/\.\d+\./g, '.shape.')
          .replace('.shape.shape.', '.shape.')}.shape`) :
      paramsObj);
  for (var key in realParamsObj) {
    var label = realParamsObj[key].label || camelcaseConvert(key),
      paramType = typeVerify(realParamsObj[key].type, [valuesObj[key]]),
      isArray = paramType.match(/\[.+\]/), isObj = paramType.match(/object/),
      keyConstruct = [];
    if (extra && extra.parentKey) keyConstruct.push(extra.parentKey);
    if (extra && extra.iteration) keyConstruct.push(extra.iteration);
    keyConstruct.push(key);
    var actualKey = keyConstruct.join('.');
    retval.push(
      isObj ? { component: 'FormObjectInputLabel', innerText: label } :
        (realParamsObj.hidden ? null : { component: 'FormLabel',
          attributes: { htmlFor: actualKey }, innerText: label
        }));

    if (isArray) {
      retval.push({
        component: 'FormSubmitButton',
        innerText: 'Add',
        attributes: { onClick: `handleArrayAdd ${actualKey}` }
      });
    }

    if (isObj) {
      if (!isArray) {
        retval.push(
          ...formFromObj(paramsObj, valuesObj, { parentKey: actualKey }))
      }
      else {
        for (let i in valuesObj[key]) {
          retval.push(
            ...formFromObj(paramsObj, valuesObj,
              { parentKey: actualKey, iteration: i }));
          retval.push({
            component: 'FormSubmitButton',
            innerText: 'Remove',
            attributes: { onClick: `handleArrayRemove ${actualKey} ${i}` }
          });
        }
      }
    }
    else  {
      if (!isArray) {
        retval.push(genInputComponent(_.get(paramsObj,
          actualKey.replace(/([a-z]+)\.([a-z]+)$/, '$1.shape.$2')
            .replace(/\.\d+\./g, '.shape.')),
        _.get(valuesObj, actualKey), actualKey));
      }
      else {
        for (let i in _.get(valuesObj, actualKey)) {
          retval.push(
            genInputComponent(_.get(paramsObj,
              actualKey.replace(/([a-z]+)\.([a-z]+)$/, '$1.shape.$2')
                .replace(/\.\d+\./g, '.shape.')),
            _.get(valuesObj, `${actualKey}.${i}`), `${actualKey}.${i}`));
          retval.push({
            component: 'FormSubmitButton',
            innerText: 'Remove',
            attributes: { onClick: `handleArrayRemove ${actualKey} ${i}` }
          });
        }
      }
    }
  }
  return retval;
};

export default { formFromObj, mapKeysToValues, outputKeys };
