const CellParser = function () {
  const isWellFormed = exp => {
    const regexp =
      /^(-?\d+(?:\.\d+)?)$|^[A-Z]([1-9]|([1-2][1-6]))$|^(ADD|SUB|MUL|DIV)\s*\(\s*((-?\d+(?:\.\d+)?)|[A-Z]([1-9]|([1-2][1-6])))\s*(,\s*((-?\d+(?:\.\d+)?)|[A-Z]([1-9]|([1-2][1-6])))\s*)*\)$/g;

    return regexp.test(exp);
  }

  // https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
  function isNumeric(str) {
    if (typeof str != "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
  }

  const base = ["isEmptyString", "isNumber", "isReference", "isOperation", "isError"]
    .reduce((obj, op) => {
      obj[op] = () => false;
      return obj;
    }, {});

  const parse = (exp = "") => {
    exp = exp.trim();
    if (exp === "") {
      return { ...base, ...{ value: exp, isEmptyString: () => true } };
    }
    if (isWellFormed(exp)) {
      if (isNumeric(exp)) {
        return { ...base, ...{ value: Number(exp), isNumber: () => true } };
      } else if (/^[A-Z]([1-9]|([1-2][1-6]))$/.test(exp)) {
        return { ...base, ...{ value: exp, isReference: () => true } };
      } else {
        const operation = exp.split("\(")[0];
        let params = exp.split("\(")[1].replace(/\(|\)|\s*/g, "").split(",");
        params = params.map(parse);
        const value = { operation, params }; // operation call
        return { ...base, ...{ value, isOperation: () => true } };
      }
    } else { //ERROR
      return { ...base, ...{ value: "ERROR", isError: () => true } };
    }
  }

  return { parse };
}();