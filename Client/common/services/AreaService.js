'use strict';

var AreaDataPrototype = Object.create(Object.prototype, {
    _id: {writable: true, value: 0, enumerable: true},
    title: { writable: true, value: "", enumerable: true },
    dateCreated: { writable: true, value: 0, enumerable: true },
    dateModified: { writable: true, value: 0, enumerable: true }
})

var Area = function(areaJSON, areaFactory) {
        //we need this to be NON-ENUMERABLE, else we get a circular dependancy when JSON.stringifying. Unfortunately setting non-enumerable on the prototype's property is not enough :(
        Object.defineProperty(this, 'uf', {writable:true, value:null, enumerable: false});
        this.uf = areaFactory;
        for (var property in AreaDataPrototype) {
            if (areaJSON[property] !== undefined) {
                this[property] = areaJSON[property];
            }
        }
        return this;
    }
	Area.prototype = Object.create(AreaDataPrototype, {
        uf: {writable: true, value: null, enumerable: false}
    });
	Area.prototype.delete = function() {
        this.uf.deleteArea(this._id);
        this.uf.areas.delete(this._id);       
    }
//} //Area


kusema.factory('areaFactory', ['$http' , '$routeParams', 'kusemaConfig', function($http, $routeParams, kusemaConfig) {

    var areaFactory = {};
    var urlBase = kusemaConfig.url()+'api/areas';

    areaFactory.getAreas = function () {
        return $http.get(urlBase);
    };

    areaFactory.getNextTenAreas = function (requestNumber) {
        return $http.get(urlBase + '/tenMore/' + requestNumber);
    };

    areaFactory.getAreaById = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    areaFactory.addArea = function (area) {
        return $http.post(urlBase + '/new/', JSON.stringify(area));
    };

    areaFactory.updateArea = function (editedArea) {
        return $http.put(urlBase + '/' + $routeParams.id, editedArea);
    };

    areaFactory.deleteArea = function (id) {
        return $http.delete(urlBase + '/' + id);
    };

    areaFactory.createArea = function(responseJSON) {
        return new Area(responseJSON, areaFactory);
    }


    areaFactory.areas = {
      numberOfRequestsForAreas: 1,
      areasList: [],
      add: function(responseJSON) {
        this.areasList.push(areaFactory.createArea(responseJSON));
      },
      addAreas: function(responseJSON) {
        this.areasList = responseJSON.map(function(areaJSON) { return areaFactory.createArea(areaJSON)});
      },
      delete: function(id) {
        var areaIndex = this.getIndexOf(id);
        if (areaIndex) {
            this.areasList.splice(areaIndex, 1);
        }
      },
      getIndexOf: function(id) {
        var possibleAreas = this.areasList.filter(function(area) {return area._id == id;});
        if (possibleAreas.length > 0) {
            return possibleAreas[0]
        } else {
            return null;
        }
      }
    };

    // Populate the areasList
    areaFactory.getNextTenAreas(0)
    .success(function (quest) {
    	areaFactory.areas.addAreas(quest);
    })
    .error(function (error) {
      console.log('Unable to load areas: ' + error + error.message);
    });


    return areaFactory;
}])
