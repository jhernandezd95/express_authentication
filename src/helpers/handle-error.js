const errorFormat = (code, name, message, field, value, issue, requestId) => ({
        code,
        name,
        message,
        details: {
            field,
            value,
            issue,
        },
        requestId
    });


function _errorMessage(type, defaultMessage, path){
    let message = '';
    switch(type){
        case 'minlength': 
            message = 'Value is shorter than the minimum allowed length';
            break;
        case 'maxlength':
            message = 'Value is longer than the maximum allowed length.';
            break;
        case 'required': 
            message = `Path ${path} is required.`; 
            break;
        case 'DuplicatedKeyValue':
            message = `There is already an object with that ${path}`
            break;
        case 'Number':
            message = `Value must be of type Number`
            break;
        case 'enum':
            message = `Not valid enum value`
            break;
        case 'Boolean':
            message = `Value must be of type Boolean`
            break;
        default:
            message = defaultMessage
            break;
    }

    return message;
}

function mongoErrorCather(err, requestId) {
    let name = ""
    let value = ""
    let path = "" 
    let type = ""
    let message = ""
    let code = ""
    if (err.message === "Invalid UUID") {
        name = "TypeError"
        type = err.message
    } else if (err.errors !== null) {
        const x = Object.keys(err.errors)[0]
        if (err.errors[x].reason !== null) {
            name = "TypeError";
            value = err.errors[x].value;
            path = err.errors[x].path
            type = err.errors[x].kind
            code = 400
        } else {
            name = err.errors[x].name
            value = err.errors[x].properties.value
            path = err.errors[x].properties.path
            type = err.errors[x].properties.type
            message = err.errors[x].properties.message
            code = 400
        }
    } else if (err.driver !== null) {
        name = "DuplicatedKey"
        value = err.keyValue[Object.keys(err.keyValue)]
        // eslint-disable-next-line prefer-destructuring
        path = Object.keys(err.keyPattern)[0]
        type = "DuplicatedKeyValue"
        code = 400
    } else {
        return err
    }

    const result = errorFormat(code, name, _errorMessage(type, message, path), path, value, type, requestId)
    return result
}

module.exports = {
    mongoErrorCather,
    errorFormat
}