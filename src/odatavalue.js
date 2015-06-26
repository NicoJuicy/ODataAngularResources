/// <reference path="references.d.ts" />
var OData;
(function (OData) {
    var ValueTypes = (function () {
        function ValueTypes() {
        }
        ValueTypes.Boolean = "Boolean";
        ValueTypes.Byte = "Byte";
        ValueTypes.DateTime = "DateTime";
        ValueTypes.Decimal = "Decimal";
        ValueTypes.Double = "Double";
        ValueTypes.Single = "Single";
        ValueTypes.Guid = "Guid";
        ValueTypes.Int32 = "Int32";
        ValueTypes.String = "String";
        return ValueTypes;
    })();
    OData.ValueTypes = ValueTypes;
    var Value = (function () {
        function Value(value, type) {
            this.value = value;
            this.type = type;
            this.illegalChars = {
                '%': '%25',
                '+': '%2B',
                '/': '%2F',
                '?': '%3F',
                '#': '%23',
                '&': '%26'
            };
        }
        Value.prototype.escapeIllegalChars = function (haystack) {
            for (var key in this.illegalChars) {
                haystack = haystack.replace(key, this.illegalChars[key]);
            }
            haystack = haystack.replace("'", "''");
            return haystack;
        };
        Value.prototype.generateDate = function (date) {
            return "datetime'" + date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ':' + ("0" + date.getSeconds()).slice(-2) + "'";
        };
        Value.prototype.executeWithUndefinedType = function () {
            if (angular.isString(this.value)) {
                return "'" + this.escapeIllegalChars(this.value) + "'";
            }
            else if (this.value === false) {
                return "false";
            }
            else if (this.value === true) {
                return "true";
            }
            else if (angular.isDate(this.value)) {
                return this.generateDate(this.value);
            }
            else if (!isNaN(this.value)) {
                return this.value;
            }
            else {
                throw "Unrecognized type of " + this.value;
            }
        };
        Value.prototype.executeWithType = function () {
            if (this.value === true || this.value === false) {
                if (this.type.toLowerCase() === "boolean") {
                    return !!this.value + "";
                }
                else if (this.type.toLowerCase() === "string") {
                    return "'" + !!this.value + "'";
                }
                else {
                    throw "Cannot convert bool (" + this.value + ") into " + this.type;
                }
            }
            if (angular.isDate(this.value)) {
                if (this.type.toLowerCase() === "decimal") {
                    return this.value.getTime() + "M";
                }
                else if (this.type.toLowerCase() === "int32") {
                    return this.value.getTime() + "";
                }
                else if (this.type.toLowerCase() === "single") {
                    return this.value.getTime() + "f";
                }
                else if (this.type.toLowerCase() === "double") {
                    return this.value.getTime() + "d";
                }
                else if (this.type.toLowerCase() === "datetime") {
                    return this.generateDate(this.value);
                }
                else if (this.type.toLowerCase() === "string") {
                    return "'" + this.value.toISOString() + "'";
                }
                else {
                    throw "Cannot convert date (" + this.value + ") into " + this.type;
                }
            }
            if (angular.isString(this.value)) {
                if (this.type.toLowerCase() === "guid") {
                    return "guid'" + this.value + "'";
                }
                else if (this.type.toLowerCase() === "datetime") {
                    return this.generateDate(new Date(this.value));
                }
                else if (this.type.toLowerCase() === "single") {
                    return parseFloat(this.value) + "f";
                }
                else if (this.type.toLowerCase() === "double") {
                    return parseFloat(this.value) + "d";
                }
                else if (this.type.toLowerCase() === "decimal") {
                    return parseFloat(this.value) + "M";
                }
                else if (this.type.toLowerCase() === "boolean") {
                    return this.value;
                }
                else if (this.type.toLowerCase() === "int32") {
                    return parseInt(this.value) + "";
                }
                else {
                    throw "Cannot convert " + this.value + " into " + this.type;
                }
            }
            else if (!isNaN(this.value)) {
                if (this.type.toLowerCase() === "boolean") {
                    return !!this.value + "";
                }
                else if (this.type.toLowerCase() === "decimal") {
                    return this.value + "M";
                }
                else if (this.type.toLowerCase() === "double") {
                    return this.value + "d";
                }
                else if (this.type.toLowerCase() === "single") {
                    return this.value + "f";
                }
                else if (this.type.toLowerCase() === "byte") {
                    return (this.value % 255).toString(16);
                }
                else if (this.type.toLowerCase() === "datetime") {
                    return this.generateDate(new Date(this.value));
                }
                else if (this.type.toLowerCase() === "string") {
                    return "'" + this.value + "'";
                }
                else {
                    throw "Cannot convert number (" + this.value + ") into " + this.type;
                }
            }
            else {
                throw "Source type of " + this.value + " to be conververted into " + this.type + "is not supported";
            }
        };
        Value.prototype.execute = function () {
            if (this.type === undefined) {
                return this.executeWithUndefinedType();
            }
            else {
                return this.executeWithType();
            }
        };
        return Value;
    })();
    OData.Value = Value;
})(OData || (OData = {}));
angular.module('ODataResources').factory('$odataValue', [function () { return OData.Value; }]);
