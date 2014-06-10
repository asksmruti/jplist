/**
* @license jPList - jQuery Data Grid Controls ##VERSION## - http://jplist.com 
* Copyright 2014 Miriam Zusin. All rights reserved.
* For non-commercial, personal, or open source projects and applications, you may use jPList for free under the terms of the GPL V3 License (https://gnu.org/licenses/gpl.html)
* If your project generates any type of income, e.g. sells products, ads, services or just represents a commercial company, you should get a commercial license at http://www.binpress.com
*/
(function(){//+
	'use strict';		
	
	/**
	* Get control status
	* @param {Object} context
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
	*/
	var getStatus = function(context, isDefault){
		
		var selected
			,data
			,status
			,filterType = ''
			,storageStatus;
				
		storageStatus = context.$control.data('storage-status');
		
		if(isDefault && storageStatus){			
			status = storageStatus;
		}
		else{			
			if(isDefault){
				selected = context.$control.attr('data-selected') === 'true';
			}
			else{
				//get selected value
				selected = context.params.selected;
			}
			
			if(selected){
				filterType = 'path';
			}
			
			data = {
				path: context.$control.attr('data-path')
				,filterType: filterType
				,selected: selected
			};
			
			//init status
			status = new jQuery.fn.jplist.app.dto.StatusDTO(
				context.name
				,context.action
				,context.type
				,data
				,context.inStorage
				,context.inAnimation
				,context.isAnimateToTop
				,context.inDeepLinking
			);
		}
		
		return status;	
	};
	
	/**
	* Get deep link
	* @param {Object} context
	* @return {string} deep link
	*/
	var getDeepLink = function(context){
		
		var deepLink = ''
			,status = null
			,isDefault = false;
		
		if(context.inDeepLinking){
		
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data && status.data.selected){
					
				//init deep link
				deepLink = context.name + context.options.delimiter0 + 'selected=true';
			}
		}
		
		return deepLink;
	};
	
	/**
	* get status by deep link
	* @param {Object} context
	* @param {string} propName - deep link property name
	* @param {string} propValue - deep link property value
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
	*/
	var getStatusByDeepLink = function(context, propName, propValue){
		
		var isDefault = false
			,status = null
			,isSelected;
		
		if(context.inDeepLinking){
		
			//get status
			status = getStatus(context, isDefault);
			
			if(status.data){
				
				isSelected = (propName === 'selected') && (propValue === 'true');
				
				if(isSelected){
					
					status.data.selected = isSelected;
					status.data.filterType = 'path';
				}
			}
		}
		
		return status;
	};
	
	/**
	* Get control paths
	* @param {Object} context
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths
	*/
	var getPaths = function(context, paths){
	
		var jqPath
			,path;		
				
		//ger data-path attribute
		jqPath = context.$control.attr('data-path');
		
		//init path
		if(jqPath){
		
			path = new jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel(jqPath, 'text');
			paths.push(path);
		}
	};
		
	/**
	* Set control status
	* @param {Object} context
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	var setStatus = function(context, status, restoredFromStorage){
		
		//save storages status
		if(context.inStorage && restoredFromStorage){			
			context.$control.data('storage-status', status);	
		}
		
		//update 'selected' value
		context.params.selected = status.data.selected;
		
		//update class
		if(status.data.selected){
			context.$control.addClass('jplist-selected');
		}
		else{
			context.$control.removeClass('jplist-selected');
		}
	};
	
	/**
	* Init control events
	* @param {Object} context
	*/
	var initEvents = function(context){
				
        /**
        * control on click
        */
		context.$control.on('click', function(){
					
			//toggle value
			context.params.selected = !context.params.selected;
			
			//save last status in the history
			context.history.addStatus(getStatus(context, false));
			
			//trigger force build statuses event
			context.observer.trigger(context.observer.events.forceRenderStatusesEvent, [false]);
		});
	};
	
	/** 
	* Dropdown control: sort dropdown, filter dropdown, paging dropdown etc.
	* @constructor
	* @param {Object} context
	*/
	var Init = function(context){
				
		context.params = {
			selected: context.$control.attr('data-selected') === 'true'
		};	

		//if deep links options is enabled -> selected is declared in its params
		if(context.options.deepLinking){			
			context.params.selected = false;
		}
				
		//init events
		initEvents(context);
				
		return jQuery.extend(this, context);
	};
	
	/**
	* Get control status
	* @param {boolean} isDefault - if true, get default (initial) control status; else - get current control status
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
	*/
	Init.prototype.getStatus = function(isDefault){
		return getStatus(this, isDefault);
	};
	
	/**
	* Get Deep Link
	* @return {string} deep link
	*/
	Init.prototype.getDeepLink = function(){
		return getDeepLink(this);
	};
	
	/**
	* Get Paths by Deep Link
	* @param {string} propName - deep link property name
	* @param {string} propValue - deep link property value
	* @return {jQuery.fn.jplist.app.dto.StatusDTO}
	*/
	Init.prototype.getStatusByDeepLink = function(propName, propValue){
		return getStatusByDeepLink(this, propName, propValue);
	};
	
	/**
	* Get Paths
	* @param {Array.<jQuery.fn.jplist.domain.dom.models.DataItemMemberPathModel>} paths
	*/
	Init.prototype.getPaths = function(paths){
		getPaths(this, paths);
	};
	
	/**
	* Set Status
	* @param {jQuery.fn.jplist.app.dto.StatusDTO} status
	* @param {boolean} restoredFromStorage - is status restored from storage
	*/
	Init.prototype.setStatus = function(status, restoredFromStorage){
		setStatus(this, status, restoredFromStorage);
	};
		
	/** 
	* Button filter control
	* @constructor
	* @param {Object} context
	*/
	jQuery.fn.jplist.ui.controls.ButtonFilter = function(context){
		return new Init(context);
	};	
		
})();

