MWF.xDesktop.requireApp("process.ProcessManager", "Explorer", null, false);
MWF.xApplication.service.ServiceManager.AgentExplorer = new Class({
	Extends: MWF.xApplication.process.ProcessManager.Explorer,
	Implements: [Options, Events],

    options: {
        "style": "default",
        "tooltip": {
            "create": MWF.xApplication.service.ServiceManager.LP.agent.create,
            "search": MWF.xApplication.service.ServiceManager.LP.agent.search,
            "searchText": MWF.xApplication.service.ServiceManager.LP.agent.searchText,
            "noElement": MWF.xApplication.service.ServiceManager.LP.agent.noAgentNoticeText
        }
    },
    createTitleElementNode: function() {
        this.titleElementNode = new Element("div", {
            "styles": this.css.titleElementNode,
            "text": "代理配置"
        }).inject(this.toolbarNode);
    },
    _createElement: function(e){
        var _self = this;
        var options = {
            "onQueryLoad": function(){
                this.actions = _self.app.restActions;
                this.application = _self.app.options.application;
                this.explorer = _self;
            }
        };
        this.app.desktop.openApplication(e, "service.AgentDesigner", options);
    },
    _loadItemDataList: function(callback){
        this.app.restActions.listAgent(callback);
    },
    _getItemObject: function(item){
        return new MWF.xApplication.service.ServiceManager.AgentExplorer.Agent(this, item)
    },
    deleteItems: function(){
        this.hideDeleteAction();
        while (this.deleteMarkItems.length){
            var item = this.deleteMarkItems.shift();
            if (this.deleteMarkItems.length){
                item.deleteAgent();
            }else{
                item.deleteAgent(function(){
                    //    this.reloadItems();
                    //this.hideDeleteAction();
                }.bind(this));
            }
        }
    }
});

MWF.xApplication.service.ServiceManager.AgentExplorer.Agent= new Class({
	Extends: MWF.xApplication.process.ProcessManager.Explorer.Item,
    createTextNodes: function(){
        var titleNode = new Element("div", {
            "styles":  this.css.itemTextTitleNode,
            "text": ( this.data.enable ? "" : "(禁用)" ) + this.data.name ,
            "title": this.data.name,
            "events": {
                "click": function(e){this._open(e);}.bind(this)
            }
        }).inject(this.node);
        if( !this.data.enable ){
            titleNode.setStyle("color","#999");
        }

        new Element("div", {
            "styles": this.css.itemTextDescriptionNode,
            "text": this.data.description || "",
            "title": this.data.description || ""
        }).inject(this.node);

        new Element("div", {
            "styles": this.css.itemTextDateNode,
            "text": (this.data.updateTime || "")
        }).inject(this.node);
    },
	_open: function(e){
        var _self = this;
        var options = {
            "onQueryLoad": function(){
                this.actions = _self.explorer.actions;
                this.category = _self;
                this.options.id = _self.data.id;
            }
        };
        this.explorer.app.desktop.openApplication(e, "service.AgentDesigner", options);
	},
	_getIcon: function(){
		var x = (Math.random()*49).toInt();
		return "process_icon_"+x+".png";
	},
	_getLnkPar: function(){
		return {
			"icon": this.explorer.path+this.explorer.options.style+"/processIcon/lnk.png",
			"title": this.data.name,
			"par": "service.AgentDesigner#{\"id\": \""+this.data.id+"\"}"
		};
	},
//	deleteItem: function(e){
//		var _self = this;
//		this.explorer.app.confirm("info", e, this.explorer.app.lp.process.deleteProcessTitle, this.explorer.app.lp.process.deleteProcess, 320, 110, function(){
//			_self.deleteProcess();
//			this.close();
//		},function(){
//			this.close();
//		});
//	},
	deleteAgent: function(callback){
		this.explorer.actions.deleteAgent(this.data.id, function(){
			this.node.destroy();
			if (callback) callback();
		}.bind(this));
	}
});
