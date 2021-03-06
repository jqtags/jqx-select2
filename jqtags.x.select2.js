_tag_("jqtags.x.select2",function(select){
	
	var jq = module("jQuery");
	
	return {
	    tagName: "jqx-select2",
	    events: {
	    },
	    accessors: {
	        value: {
	            type: "string",
	            default : "",
	            onChange : "valueOnChange"
	        },
	        popup : {
	        	type : "boolean",
	        	default : true
	        },
          placeholder : {
            type : "string",
            default : "Select"
          },
          emptyString : {
            type : "string",
            default : "Select"
          }
	    },
	    attachedCallback : function () {
	    	var self = this;
	    	this.$a = 
	    	this.$.innerHTML = '<a href=# data-type=select2 data-title="'+ this.$.placeholder +'" >'+this.$.emptyString+'</a>';
	    	this.$a =jQuery(this.$).find("a");
          self.mySelectedOptions ={};
          self.selected = [];
          self.setValue(self.$.value);

          self.trigger("jq.init",{
            value : self.$.value,
            populate : function(selected){
              //self.selected = selected;
              // self.setValue(self.$.value);
              self.addOptions(selected);
              self.setValue(self.$.value);
            }
          });

          self.$a.editable({
            send : 'never',
            select2: {
              multiple: false,
              placeholder : self.$.placeholder,
              query : function(e,b) {
                self.trigger("jq.query",{
                  value : self.$.value,
                  setOptions : function(options){
                    return e.callback({
                      results : options
                    });
                  }
                });
              },
              formatSelection: function(item) {
                self.mySelectedOptions[item.id] = item.text;
                self.trigger("jq.selected",{
                  item : item,
                  format : function(disp){
                    self.mySelectedOptions[item.id] = disp;
                  }
                });
                return item.text;
              },
              initSelection: function (element, callback) {
                console.log("wewe",element, callback);
                //callback(self.setValue(self.$.value))
              }
            },
            mode : (self.$.popup ? 'popup' : 'inline')
           // title: 'Enter username'
          }).on("save",debounce(function(e,params){
            self.$.value = params.newValue;
            self.setValue(params.newValue);
            self.trigger("change");
            self.trigger("input");
          }));//.trigger("change");
	    },
	    detachedCallback : function(){
        this.$a.editable("destroy");
	    },
      addOptions : function(options){
          for(var i in options){
            this.mySelectedOptions[options[i].id] = options[i].text;
          }
      },
      setValue : function(newValue){
        if(newValue === undefined) return;
        var finalValues = [];
        var newValues = [(newValue+"").split(",")[0]];
        this.selected = [];
        for(var i in newValues){
          finalValues.push(this.mySelectedOptions[newValues[i]] || newValues[i]);
          this.selected.push({ id : newValues[i], text : this.mySelectedOptions[newValues[i]] || newValues[i]});
        }
        var finalValue = finalValues.join(",");
        this.$a.text(!is.Empty(finalValue) ? finalValue : this.$.emptyString);
        return this.selected;
      },
	    valueOnChange : function(e,oldValue,newValue){
        this.setValue(newValue);
	    }
	};
});