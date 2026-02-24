/**
 * Reference
 * https://medium.com/@srajas02/merge-two-objects-deeply-nested-in-javascript-8e8515b4f8d3
 *
 */

/**
 * This function will accept the two objects as arguments and return the object of deeply
 * merged with nested properties.
 * @param {object} targetObject objects containing the properties to be merged with source.
 * @param {object} sourceObject objects containing the properties you want to apply.
 * @return {object} return the deeply merged objects
 */
function deepMergeObject(targetObject = {}, sourceObject = {}) {
  // clone the source and target objects to avoid the mutation
  const copyTargetObject = JSON.parse(JSON.stringify(targetObject));
  const copySourceObject = JSON.parse(JSON.stringify(sourceObject));
  // Iterating through all the keys of source object
  Object.keys(copySourceObject).forEach((key) => {
    if (
      copySourceObject[key] != null &&
      typeof copySourceObject[key] === 'object' &&
      !Array.isArray(copySourceObject[key])
    ) {
      // If property has nested object, call the function recursively
      copyTargetObject[key] = deepMergeObject(
        copyTargetObject[key],
        copySourceObject[key]
      );
    }
    //
    // this is added by siukatech to handle function copy 
    else if (typeof copySourceObject[key] === 'function') {
      if (targetObject[key] != null) {
        copyTargetObject[key] = targetObject[key];
      }
      if (sourceObject[key] != null) {
        copyTargetObject[key] = sourceObject[key];
      }
    }
    //
    //
    else {
      // else merge the object source to target
      copyTargetObject[key] = copySourceObject[key];
    }
  });
  //
  // this is added by siukatech to handle function copy 
  Object.keys(targetObject).forEach(key => {
    if (targetObject[key] != null && typeof targetObject[key] === 'function') {
      copyTargetObject[key] = targetObject[key];
    }
  });
  Object.keys(sourceObject).forEach(key => {
    if (sourceObject[key] != null && typeof sourceObject[key] === 'function') {
      copyTargetObject[key] = sourceObject[key];
    }
  });
  //
  //

  return copyTargetObject;
}

// Target Object
const targetPerson = {
  name: 'Raja',
  age: 30,
  vehicles: {
    car: 'limousine',
    bike: 'ktm-duke',
    airlines: {
      lufthansa: 'Air123',
      'British airways': 'Brt707',
    },
  },
  jobs: [
    {
      name: 'Job 1',
    },
  ],
};

// Source Object
const sourcePerson = {
  vehicles: {
    airlines: {
      lufthansa: 'Override Air123',
      'British airways': 'Override Brt707',
    },
  },
  jobs: [
    {
      name: 'Override Job 1',
    },
  ],
};

const mergedPerson = deepMergeObject(targetPerson, sourcePerson);
// console.debug(mergedPerson);

/////////////////////////////////////////

/**
 * Reference
 * https://www.makeuseof.com/how-to-import-and-export-functions-in-javascript/#:~:text=You%20can%20export%20this%20function,just%20before%20declaring%20the%20function.
 */

export { deepMergeObject };

