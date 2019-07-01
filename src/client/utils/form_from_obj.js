import { loget } from './lofuncs';
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
  function(paramObj, paramSpec, valueVar, keyToUse, index, formVal,
    invalidFields) {
    let theType = typeof paramSpec.type === 'function' ?
      calcFromDependValues(
        paramSpec, 'type', formVal, keyToUse) : paramSpec.type;

    if (theType.match(/enum/)) {
      return {
        component: 'FormEnumInput',
        attributes: {
          id: keyToUse,
          name: keyToUse,
          invalid: invalidFields && invalidFields.includes(keyToUse) || false,
          onChange: `handleChange ${keyToUse}`,
          value: valueVar,
          required: paramSpec.required || false
        },
        children: paramSpec.enumList.map((option) => ({
          component: 'FormEnumInputOption',
          attributes: { value: option.value },
          innerText: option.text
        })),
      }
    }
    else if (theType.match(/text/)) {
      if (paramSpec.grammar) {
        return {
          component: 'CodeEditor',
          attributes: {
            invalid: invalidFields && invalidFields.includes(keyToUse) || false,
            id: keyToUse,
            name: keyToUse,
            grammar: paramSpec.grammar,
            value: valueVar || '',
            hidden: paramSpec.hidden || false,
            required: paramSpec.required || false
          }
        };
      }
      else if (paramSpec.maximum && paramSpec.maximum !== '') {
        return {
          component: 'FormInput',
          attributes: {
            invalid: invalidFields && invalidFields.includes(keyToUse) || false,
            id: keyToUse,
            name: keyToUse,
            type: 'text',
            maxLength: paramSpec.maximum,
            onChange: `handleChange ${keyToUse}`,
            value: valueVar,
            hidden: paramSpec.hidden || false,
            required: paramSpec.required || false
          }
        };
      }
      else {
        return {
          component: 'FormInput',
          attributes: {
            invalid: invalidFields && invalidFields.includes(keyToUse) || false,
            id: keyToUse,
            name: keyToUse,
            type: 'text',
            onChange: `handleChange ${keyToUse}`,
            hidden: paramSpec.hidden || false,
            value: valueVar,
            required: paramSpec.required || false
          }
        };
      }
    }
    else {
      let retval = {
        component: 'FormInput',
        attributes: {
          invalid: invalidFields && invalidFields.includes(keyToUse) || false,
          id: keyToUse,
          name: keyToUse,
          type: theType.match(/[a-z]+/)[0],
          onChange: `handleChange ${keyToUse}`,
          value: valueVar,
          hidden: paramSpec.hidden || false,
          required: paramSpec.required || false
        }
      };

      if (paramSpec.minimum) {
        retval.attributes.minimum = paramSpec.minimum;
      }

      if (paramSpec.maximum) {
        retval.attributes.maximum = paramSpec.maximum;
      }

      return retval;
    }
  };


const numKeyToShapeKey = function(key) {
  return key.replace(/([a-z]+)\.([a-z]+)$/, '$1.shape.$2')
    .replace(/\.\d+\./g, '.shape.').replace('.shape.shape.', '.shape.')
};

const formFromObj = function(paramsObj, valuesObj, extra, invalidFields) {
  let retval = [],
    realParamsObj = Object.assign({}, (extra && extra.parentKey) ?
      loget(paramsObj,`${numKeyToShapeKey(extra.parentKey)}.shape`) :
      paramsObj);
  for (var key in realParamsObj) {
    var { label } = realParamsObj[key],
      paramType = typeVerify(realParamsObj[key].type, [valuesObj[key]]),
      isArray = paramType.match(/\[.+\]/), isObj = paramType.match(/object/),
      keyConstruct = [];
    if (!label) label = camelcaseConvert(key);
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
          ...formFromObj(paramsObj, valuesObj, { parentKey: actualKey },
            invalidFields))
      }
      else {
        for (let i in valuesObj[key]) {
          retval.push(
            ...formFromObj(paramsObj, valuesObj,
              { parentKey: actualKey, iteration: i }, invalidFields));
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
        retval.push(genInputComponent(paramsObj, loget(paramsObj,
          numKeyToShapeKey(actualKey)), loget(valuesObj, actualKey), actualKey,
        undefined, valuesObj, invalidFields));
      }
      else {
        for (let i in loget(valuesObj, actualKey)) {
          retval.push(
            genInputComponent(paramsObj, loget(paramsObj,
              numKeyToShapeKey(actualKey)),
            loget(valuesObj, `${actualKey}.${i}`),
            `${actualKey}.${i}`, i, valuesObj, invalidFields));
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

const checkRequired = function(paramObj, valueObj) {
  let invalidFields = [], pks = mapKeysToValues(paramObj), reqFields =
      outputKeys(paramObj).filter(k => k.endsWith('.required')).map(
        k => k.replace('.required', '')), vks = outputKeys(valueObj),
    vs = mapKeysToValues(valueObj);

  for (let reqField in reqFields) {
    if (pks[`${reqFields[reqField]}.required`]) {
      let relevant = vks.filter(k =>
        reqFields[reqField] === numKeyToShapeKey(k));
      for (let r in relevant) {
        if (!vs[relevant[r]] || vs[relevant[r]] === '') {
          invalidFields.push(relevant[r]);
        }
      }
    }
  }

  return invalidFields;
};

const validateForm = function(paramObj, valueObj) {
  let reqd = checkRequired(paramObj, valueObj);
  return ![...reqd].flat().length || [...reqd].flat();
};

export default { formFromObj, mapKeysToValues, outputKeys, validateForm,
  numKeyToShapeKey };
