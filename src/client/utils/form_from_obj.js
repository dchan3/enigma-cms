import { get as loget } from 'lodash';
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
  let keys = outputKeys(obj, false), retval = {};
  for (let key in keys) {
    retval[keys[key]] = loget(obj, keys[key]);
  }
  return retval;
};

const typeVerify = function(typeVar, argsToPass) {
  return typeof typeVar === 'function' ?
    typeVar(...argsToPass) :
    typeVar;
};

const calcFromDependValues = function(paramSpec, attr, formVal, keyToUse) {
  let args = paramSpec.attrDepends[attr].map(function(valVar) {
    let index = keyToUse.match(/\.(\d+(?!\w))/g).pop().substring(1);
    return loget(formVal, index !== undefined ?
      valVar.replace('$', index.toString()) : valVar);
  });
  return paramSpec[attr](...args);
};

const genInputComponent =
  function(paramObj, paramSpec, valueVar, keyToUse, index, formVal) {
    let theType = typeof paramSpec.type === 'function' ?
      calcFromDependValues(
        paramSpec, 'type', formVal, keyToUse) :
      paramSpec.type;

    if (theType.match(/enum/)) {
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
    else if (theType.match(/text/)) {
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
      else if (paramSpec.hidden) {
        return {
          component: 'FormInput',
          attributes: {
            id: keyToUse,
            name: keyToUse,
            type: 'text',
            onChange: `handleChange ${keyToUse}`,
            value: valueVar,
            hidden: true
          }
        };
      }
      else {
        return {
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
    }
    else {
      let retval = {
        component: 'FormInput',
        attributes: {
          id: keyToUse,
          name: keyToUse,
          type: theType.match(/[a-z]+/)[0],
          onChange: `handleChange ${keyToUse}`,
          value: valueVar
        }
      };

      if (paramSpec.hidden) {
        retval.attributes.hidden = paramSpec.hidden;
      }

      if (paramSpec.minimum) {
        retval.attributes.minimum = paramSpec.minimum;
      }

      if (paramSpec.maximum) {
        retval.attributes.maximum = paramSpec.maximum;
      }

      return retval;
    }
  };

const formFromObj = function(paramsObj, valuesObj, extra) {
  let retval = [],
    realParamsObj = Object.assign({}, (extra && extra.parentKey) ?
      loget(paramsObj,
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
        (realParamsObj[key].hidden ? null : { component: 'FormLabel',
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
        retval.push(
          genInputComponent(paramsObj,
            loget(paramsObj,
              actualKey.replace(
                /([a-z]+)\.([a-z]+)$/, '$1.shape.$2')
                .replace(/\.\d+\./g, '.shape.')),
            loget(valuesObj, actualKey), actualKey, undefined, valuesObj));
      }
      else {
        for (let i in loget(valuesObj, actualKey)) {
          retval.push(
            genInputComponent(paramsObj, loget(paramsObj,
              actualKey.replace(/([a-z]+)\.([a-z]+)$/, '$1.shape.$2')
                .replace(/\.\d+\./g, '.shape.')),
            loget(valuesObj, `${actualKey}.${i}`),
            `${actualKey}.${i}`, i, valuesObj));
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
