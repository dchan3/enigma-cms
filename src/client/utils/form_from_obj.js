import { loget } from '../../lib/utils/lofuncs';
import { default as camelcaseConvert } from './camelcase_convert';

const outputKeys = function(obj, includeParents, parent) {
  var retval = [];
  for (var key in obj) {
    if (typeof obj[key] === 'object') {
      if (includeParents) retval.push(parent ? `${parent}.${key}` : key);
      retval.push(...outputKeys(obj[key], includeParents, parent ?
        `${parent}.${key}` : key));
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
  return typeof typeVar === 'function' ? typeVar(...argsToPass) : typeVar;
};

const calcFromDependValues = function(paramSpec, attr, formVal, keyToUse) {
  let args = paramSpec.attrDepends[attr].map(function(valVar) {
    let idxMtch = keyToUse.match(/\.(\d+(?!\w))/g), index = undefined;
    if (idxMtch) index = idxMtch.pop().substring(1);
    return loget(formVal, index !== undefined ?
      valVar.replace('$', index.toString()) : valVar);
  });
  return paramSpec[attr](...args);
};

const retThing = {
  enum: 'FormEnumInput',
  text: ['FormInput', 'CodeEditor'],
  defo: 'FormInput'
};

const chooseComponent = (type, hasGrammar) => {
  let m = retThing[type.match(/[a-z]+/)[0]] || retThing['defo'];
  return (typeof m === 'object') ? m[+hasGrammar] : m;
}

const genInputComponent =
  function(paramObj, paramSpec, valueVar, keyToUse, index, formVal,
    invalidFields) {
    let theType = typeof paramSpec.type === 'function' ?
        calcFromDependValues(paramSpec, 'type', formVal, keyToUse) :
        paramSpec.type, attributes = {
        id: keyToUse,
        name: keyToUse,
        isInvalid: invalidFields && invalidFields.includes(keyToUse) || false,
        onChange: `handleChange ${keyToUse}`,
        value: valueVar,
        required: paramSpec.required || false,
        hidden: paramSpec.hidden || false,
      };

    attributes = { ...paramSpec, ...attributes };

    if (paramSpec.maximum) {
      if (theType.match(/text/)) {
        delete attributes.maximum;
        attributes.maxLength = paramSpec.maximum;
      }
    }

    if (!theType.match(/enum/)) {
      attributes.type = theType.match(/[a-z]+/)[0];
      attributes.noValidate = true;
    }

    let retval = {
      component: chooseComponent(theType, paramSpec.grammar ? true : false),
      attributes
    }

    if (paramSpec.enumList) {
      retval.children = paramSpec.enumList.map((option) => ({
        component: 'FormEnumInputOption',
        attributes: { value: option.value },
        innerText: option.text
      }));
    }

    return retval;
  };


const numKeyToShapeKey = function(key) {
  return key.replace(/([a-z]+)\.([a-z]+)$/, '$1.shape.$2')
    .replace(/\.\d+\./g, '.shape.').replace('.shape.shape.', '.shape.');
};

const emptyValuesObj = function(paramsObj) {
  let retval = {};
  for (let k in paramsObj) {
    retval[k] = paramsObj[k].type === 'object' ? (emptyValuesObj(
      paramsObj[k].shape)) :
      (paramsObj[k].type.startsWith('[') ? [] : '');
  }
  return retval;
}

const formFromObj = function(paramsObj, valuesObj, extra, invalidFields) {
  let retval = [],
    realParamsObj = Object.assign({}, (extra && extra.parentKey) ?
      loget(paramsObj,`${numKeyToShapeKey(extra.parentKey)}.shape`) :
      paramsObj), realValuesObj = valuesObj && Object.keys(valuesObj).length ?
      valuesObj : {}, pushFunc = function(actualKey, i = null) {
      let par = { parentKey: actualKey };
      if (i) par.iteration = i;
      if (!Object.keys(valuesObj).length) {
        realValuesObj = emptyValuesObj(paramsObj);
      }
      retval.push(
        ...formFromObj(paramsObj, realValuesObj, par, invalidFields));
    }, genComp = function(actualKey, i = null) {
      let thaKey = actualKey + (i ? `.${i}` : '');

      retval.push(genInputComponent(paramsObj, loget(paramsObj,
        numKeyToShapeKey(actualKey)), loget(realValuesObj, thaKey), thaKey,
      i && undefined , realValuesObj, invalidFields));
    }, arrayRemPush = function(actualKey, i) {
      retval.push({
        component: 'FormSubmitButton',
        innerText: 'Remove',
        attributes: { onClick: `handleArrayRemove ${actualKey} ${i}` }
      });
    }

  for (var key in realParamsObj) {
    var { label } = realParamsObj[key],
      paramType = typeVerify(realParamsObj[key].type, [realValuesObj[key]]),
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

    if (isArray) {
      for (let i in isObj ? realValuesObj[key] : loget(realValuesObj, actualKey)) {
        isObj ? pushFunc(actualKey, i) : genComp(actualKey, i);
        arrayRemPush(actualKey, i);
      }
    }
    else {
      isObj ? pushFunc(actualKey) : genComp(actualKey);
    }
  }
  return retval;
};

const checkRequired = function(paramObj, valueObj) {
  let invalidFields = [], pks = mapKeysToValues(paramObj), reqFields =
      outputKeys(paramObj).filter(k => k.endsWith('.required')).map(
        k => k.replace('.required', '')), vks = outputKeys(valueObj),
    vs = mapKeysToValues(valueObj);

  for (let reqField of reqFields) {
    if (pks[`${reqField}.required`]) {
      if (vks.indexOf(reqField) > -1) {
        invalidFields.push(reqField);
      }
      else {
        let relevant = vks.filter(k => reqField === numKeyToShapeKey(k));

        for (let r of relevant) {
          console.log(vs, r);
          console.log(loget(vs, r));
          if (!loget(vs, r) || loget(vs, r) === '') {
            invalidFields.push(r);
          }
        }
      }
    }
  }

  return invalidFields;
};

const validateForm = function(paramObj, valueObj) {
  let reqd = [...checkRequired(paramObj, valueObj)].flat();
  return reqd.length ? reqd : true;
};

export default { formFromObj, mapKeysToValues, outputKeys, validateForm,
  numKeyToShapeKey, emptyValuesObj };
