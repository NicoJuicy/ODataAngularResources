/// <reference path="references.d.ts" />
var OData;
(function (OData) {
    var Provider = (function () {
        function Provider(callback) {
            this.callback = callback;
            this.filters = [];
            this.sortOrders = [];
            this.takeAmount = undefined;
            this.skipAmount = undefined;
            this.expandables = [];
        }
        Provider.prototype.filter = function (operand1, operand2, operand3) {
            if (operand1 === undefined)
                throw "The first parameted is undefined. Did you forget to invoke the method as a constructor by adding the 'new' keyword?";
            var predicate;
            if (angular.isFunction(operand1.execute) && operand2 === undefined) {
                predicate = operand1;
            }
            else {
                predicate = new OData.BinaryOperation(operand1, operand2, operand3);
            }
            this.filters.push(predicate);
            return this;
        };
        Provider.prototype.orderBy = function (arg1, arg2) {
            this.sortOrders.push(new OData.OrderByStatement(arg1, arg2));
            return this;
        };
        Provider.prototype.take = function (amount) {
            this.takeAmount = amount;
            return this;
        };
        Provider.prototype.skip = function (amount) {
            this.skipAmount = amount;
            return this;
        };
        Provider.prototype.execute = function () {
            var queryString = '';
            var i;
            if (this.filters.length > 0) {
                queryString = "$filter=" + OData.Predicate.and(this.filters).execute(true);
            }
            if (this.sortOrders.length > 0) {
                if (queryString !== "")
                    queryString += "&";
                queryString += "$orderby=";
                for (i = 0; i < this.sortOrders.length; i++) {
                    if (i > 0) {
                        queryString += ",";
                    }
                    queryString += this.sortOrders[i].execute();
                }
            }
            if (this.takeAmount) {
                if (queryString !== "")
                    queryString += "&";
                queryString += "$top=" + this.takeAmount;
            }
            if (this.skipAmount) {
                if (queryString !== "")
                    queryString += "&";
                queryString += "$skip=" + this.skipAmount;
            }
            if (this.expandables.length > 0) {
                if (queryString !== "")
                    queryString += "&";
                queryString += "$expand=";
                for (i = 0; i < this.expandables.length; i++) {
                    if (i > 0) {
                        queryString += ",";
                    }
                    queryString += this.expandables[i];
                }
            }
            return queryString;
        };
        Provider.prototype.query = function (success, error) {
            if (!angular.isFunction(this.callback))
                throw "Cannot execute query, no callback was specified";
            success = success || angular.noop;
            error = error || angular.noop;
            return this.callback(this.execute(), success, error);
        };
        Provider.prototype.single = function (success, error) {
            if (!angular.isFunction(this.callback))
                throw "Cannot execute get, no callback was specified";
            success = success || angular.noop;
            error = error || angular.noop;
            return this.callback(this.execute(), success, error, true, true);
        };
        Provider.prototype.get = function (data, success, error) {
            if (!angular.isFunction(this.callback))
                throw "Cannot execute get, no callback was specified";
            success = success || angular.noop;
            error = error || angular.noop;
            return this.callback("(" + data + ")", success, error, true);
        };
        Provider.prototype.expand = function (params, otherParam1, otherParam2, otherParam3, otherParam4, otherParam5, otherParam6, otherParam7) {
            if (!angular.isString(params) && !angular.isArray(params)) {
                throw "Invalid parameter passed to expand method (" + params + ")";
            }
            if (params === "") {
                return;
            }
            var expandQuery = params;
            if (angular.isArray(params)) {
                expandQuery = params.join('/');
            }
            else {
                expandQuery = Array.prototype.slice.call(arguments).join('/');
            }
            for (var i = 0; i < this.expandables.length; i++) {
                if (this.expandables[i] === expandQuery)
                    return this;
            }
            this.expandables.push(expandQuery);
            return this;
        };
        return Provider;
    })();
    OData.Provider = Provider;
})(OData || (OData = {}));
angular.module('ODataResources').
    factory('$odataProvider', [function () { return OData.Provider; }]);
