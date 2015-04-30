'use strict';

var UnitDataPrototype = Object.create(Object.prototype, {
    _id: {writable: true, value: 0, enumerable: true},
    title: { writable: true, value: "", enumerable: true },
    code: { writable: true, value: 0, enumerable: true }, //TODO add object ID requirement here
    dateCreated: { writable: true, value: 0, enumerable: true },
    dateModified: { writable: true, value: 0, enumerable: true }
})

var Unit = function(unitJSON, unitFactory) {
        //we need this to be NON-ENUMERABLE, else we get a circular dependancy when JSON.stringifying. Unfortunately setting non-enumerable on the prototype's property is not enough :(
        Object.defineProperty(this, 'uf', {writable:true, value:null, enumerable: false});
        this.uf = unitFactory;
        for (var property in UnitDataPrototype) {
            if (unitJSON[property] !== undefined) {
                this[property] = unitJSON[property];
            }
        }
        return this;
    }
	Unit.prototype = Object.create(UnitDataPrototype, {
        uf: {writable: true, value: null, enumerable: false}
    });
	Unit.prototype.delete = function() {
        this.uf.deleteUnit(this._id);
        this.uf.units.delete(this._id);       
    }
//} //Unit


kusema.factory('unitFactory', ['$http' , '$routeParams', 'kusemaConfig', function($http, $routeParams, kusemaConfig) {

    var unitFactory = {};
    var urlBase = kusemaConfig.url()+'api/units';

    unitFactory.getUnits = function () {
        return $http.get(urlBase);
    };

    unitFactory.getNextTenUnits = function (requestNumber) {
        return $http.get(urlBase + '/tenMore/' + requestNumber);
    };

    unitFactory.getUnitById = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    unitFactory.addUnit = function (unit) {
        return $http.post(urlBase + '/new/', JSON.stringify(unit));
    };

    unitFactory.updateUnit = function (editedUnit) {
        return $http.put(urlBase + '/' + $routeParams.id, editedUnit);
    };

    unitFactory.deleteUnit = function (id) {
        return $http.delete(urlBase + '/' + id);
    };

    unitFactory.createUnit = function(responseJSON) {
        return new Unit(responseJSON, unitFactory);
    }


    unitFactory.units = {
      numberOfRequestsForUnits: 1,
      unitsList: [],
      add: function(responseJSON) {
        this.unitsList.push(unitFactory.createUnit(responseJSON));
      },
      addUnits: function(responseJSON) {
        this.unitsList = responseJSON.map(function(unitJSON) { return unitFactory.createUnit(unitJSON)});
      },
      delete: function(id) {
        var unitIndex = this.getIndexOf(id);
        if (unitIndex) {
            this.unitsList.splice(unitIndex, 1);
        }
      },
      getIndexOf: function(id) {
        var possibleUnits = this.unitsList.filter(function(unit) {return unit._id == id;});
        if (possibleUnits.length > 0) {
            return possibleUnits[0]
        } else {
            return null;
        }
      }
    };

    // Populate the unitsList
    unitFactory.getNextTenUnits(0)
    .success(function (quest) {
    	unitFactory.units.addUnits(quest);
    })
    .error(function (error) {
      console.log('Unable to load units: ' + error + error.message);
    });


    return unitFactory;
}])
