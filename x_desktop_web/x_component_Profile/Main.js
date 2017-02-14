MWF.xApplication.Profile.options.multitask = false;
MWF.xApplication.Profile.Main = new Class({
    Extends: MWF.xApplication.Common.Main,
    Implements: [Options, Events],

    options: {
        "style": "default",
        "name": "Profile",
        "icon": "icon.png",
        "width": "800",
        "height": "600",
        "isResize": false,
        "isMax": false,
        "title": MWF.xApplication.Profile.LP.title
    },
    onQueryLoad: function(){
        this.lp = MWF.xApplication.Profile.LP;
    },
    loadApplication: function(callback){
        this.loadTitle();
        this.loadContent();
    },

    loadTitle: function(){
        this.loadTitleBar();
        this.loadTitleUserNode();
        this.loadTitleTextNode();
    },

    loadTitleBar: function(){
        this.titleBar = new Element("div", {
            "styles": this.css.titleBar
        }).inject(this.content);
    },
    loadTitleUserNode: function(){
        this.titleUserNode = new Element("div", {
            "styles": this.css.titleUserNode
        }).inject(this.titleBar);
        this.titleUserIconNode = new Element("div", {
            "styles": this.css.titleUserIconNode
        }).inject(this.titleUserNode);
        this.titleUserTextNode = new Element("div", {
            "styles": this.css.titleUserTextNode,
            "text": this.desktop.session.user.name
        }).inject(this.titleUserNode);
    },
    loadTitleTextNode: function(){
        this.taskTitleTextNode = new Element("div", {
            "styles": this.css.titleTextNode,
            "text": this.lp.title
        }).inject(this.titleBar);
    },

    loadContent: function(){
        this.contentNode = new Element("div", {"styles": this.css.contentNode}).inject(this.content);
        MWF.require("MWF.widget.Tab", function(){
            this.tab = new MWF.widget.Tab(this.contentNode, {"style": "profile"});
            this.tab.load();

            this.loadInforConfigNode();
            this.loadLayoutConfigNode();
            this.loadIdeaConfigNode();
            this.loadPasswordConfigNode();

            this.inforConfigPage = this.tab.addTab(this.inforConfigNode, this.lp.inforConfig);
            this.layoutConfigPage = this.tab.addTab(this.layoutConfigNode, this.lp.layoutConfig);
            this.ideaConfigPage = this.tab.addTab(this.ideaConfigNode, this.lp.ideaConfig);
            this.passwordConfigPage = this.tab.addTab(this.passwordConfigNode, this.lp.passwordConfig);

            if (this.options.tab){
                this[this.options.tab].showIm();
            }else{
                this.inforConfigPage.showIm();
            }

        }.bind(this));
    },
    loadInforConfigNode: function(){
        this.inforConfigNode = new Element("div", {"styles": this.css.configNode}).inject(this.content);
        this.inforConfigAreaNode = new Element("div", {"styles": this.css.inforConfigAreaNode}).inject(this.inforConfigNode);

        this.getAction(function(){
            this.action.getPerson(function(json){
                this.personData = json.data;
                var icon = json.data.icon;
                if (!icon){
                    if (json.data.genderType=="f"){
                        icon = "/x_component_Profile/$Main/"+this.options.style+"/female.png";
                    }else{
                        icon = "/x_component_Profile/$Main/"+this.options.style+"/man.png";
                    }
                }else{
                    icon = "data:image/png;base64,"+icon;
                }

                //var html = "<table width='100%' border='0' cellpadding='5px'>" +
                //    "<tr><td>头像：</td><td><img src='"+icon+"' style='width:72px; height: 72px; border:0px; float:left'/>" +
                //    "<div style='margin: 20px 10px; cursor: pointer; float: left; border: 1px solid #999; padding: 3px 5px'>更换头像</div></td></tr>" +
                //    "<tr><td>姓名：</td><td>"+json.data.name+"</td></tr>" +
                //    "<tr><td>工号：</td><td>"+json.data.employee+"</td></tr>" +
                //    "<tr><td>邮件：</td><td></td></tr>" +
                //    "<tr><td>微信：</td><td>"+json.data.employee+"</td></tr>" +
                //    "<tr><td>手机：</td><td>"+json.data.employee+"</td></tr>" +
                //    "<tr><td>QQ：</td><td>"+json.data.employee+"</td></tr>" +
                //    "</table>"
                //this.inforConfigAreaNode.set("html", html);
                var _self = this;

                var lineNode = new Element("div", {"styles": this.css.inforLineNode}).inject(this.inforConfigAreaNode);
                var titleNode = new Element("div", {"styles": this.css.inforIconTitleNode, "text": this.lp.icon}).inject(lineNode);
                var contentNode = new Element("div", {"styles": this.css.inforIconContentNode}).inject(lineNode);
                this.contentImgNode = new Element("img", {"styles": this.css.inforIconContentImgNode, "src": icon}).inject(contentNode);
                var actionNode = new Element("div", {"styles": this.css.inforChangeIconNode, "text": this.lp.changeIcon, "events": {
                    "click": function(){this.changeIcon();}.bind(this)
                }}).inject(lineNode);

                var lineNode = new Element("div", {"styles": this.css.inforLineNode}).inject(this.inforConfigAreaNode);
                var titleNode = new Element("div", {"styles": this.css.inforTitleNode, "text": this.lp.name}).inject(lineNode);
                var contentNode = new Element("div", {"styles": this.css.inforContentNode, "text": json.data.name}).inject(lineNode);

                var lineNode = new Element("div", {"styles": this.css.inforLineNode}).inject(this.inforConfigAreaNode);
                var titleNode = new Element("div", {"styles": this.css.inforTitleNode, "text": this.lp.display}).inject(lineNode);
                var contentNode = new Element("div", {"styles": this.css.inforContentNode, "text": json.data.employee}).inject(lineNode);

                var lineNode = new Element("div", {"styles": this.css.inforLineNode}).inject(this.inforConfigAreaNode);
                var titleNode = new Element("div", {"styles": this.css.inforTitleNode, "text": this.lp.display}).inject(lineNode);
                var contentNode = new Element("div", {"styles": this.css.inforContentNode}).inject(lineNode);
                this.displayInputNode = new Element("input", {"styles": this.css.inforContentInputNode, "value": json.data.display, "events": {
                    "blur": function(){this.setStyles(_self.css.inforContentInputNode);},
                    "focus": function(){this.setStyles(_self.css.inforContentInputNode_focus);}
                }}).inject(contentNode);

                var lineNode = new Element("div", {"styles": this.css.inforLineNode}).inject(this.inforConfigAreaNode);
                var titleNode = new Element("div", {"styles": this.css.inforTitleNode, "text": this.lp.mail}).inject(lineNode);
                var contentNode = new Element("div", {"styles": this.css.inforContentNode}).inject(lineNode);
                this.mailInputNode = new Element("input", {"styles": this.css.inforContentInputNode, "value": json.data.mail, "events": {
                    "blur": function(){this.setStyles(_self.css.inforContentInputNode);},
                    "focus": function(){this.setStyles(_self.css.inforContentInputNode_focus);}
                }}).inject(contentNode);

                var lineNode = new Element("div", {"styles": this.css.inforLineNode}).inject(this.inforConfigAreaNode);
                var titleNode = new Element("div", {"styles": this.css.inforTitleNode, "text": this.lp.mobile}).inject(lineNode);
                var contentNode = new Element("div", {"styles": this.css.inforContentNode}).inject(lineNode);
                this.mobileInputNode = new Element("input", {"styles": this.css.inforContentInputNode, "value": json.data.mobile, "events": {
                    "blur": function(){this.setStyles(_self.css.inforContentInputNode);},
                    "focus": function(){this.setStyles(_self.css.inforContentInputNode_focus);}
                }}).inject(contentNode);

                var lineNode = new Element("div", {"styles": this.css.inforLineNode}).inject(this.inforConfigAreaNode);
                var titleNode = new Element("div", {"styles": this.css.inforTitleNode, "text": this.lp.weixin}).inject(lineNode);
                var contentNode = new Element("div", {"styles": this.css.inforContentNode}).inject(lineNode);
                this.weixinInputNode = new Element("input", {"styles": this.css.inforContentInputNode, "value": json.data.weixin, "events": {
                    "blur": function(){this.setStyles(_self.css.inforContentInputNode);},
                    "focus": function(){this.setStyles(_self.css.inforContentInputNode_focus);}
                }}).inject(contentNode);

                var lineNode = new Element("div", {"styles": this.css.inforLineNode}).inject(this.inforConfigAreaNode);
                var titleNode = new Element("div", {"styles": this.css.inforTitleNode, "text": this.lp.QQ}).inject(lineNode);
                var contentNode = new Element("div", {"styles": this.css.inforContentNode}).inject(lineNode);
                this.qqInputNode = new Element("input", {"styles": this.css.inforContentInputNode, "value": json.data.qq, "events": {
                    "blur": function(){this.setStyles(_self.css.inforContentInputNode);},
                    "focus": function(){this.setStyles(_self.css.inforContentInputNode_focus);}
                }}).inject(contentNode);

                var lineNode = new Element("div", {"styles": this.css.inforLineNode}).inject(this.inforConfigAreaNode);
                var titleNode = new Element("div", {"styles": this.css.inforTitleNode, "text": this.lp.signature}).inject(lineNode);
                var contentNode = new Element("div", {"styles": this.css.inforContentNode}).inject(lineNode);
                this.signatureInputNode = new Element("input", {"styles": this.css.inforContentInputNode, "value": json.data.signature, "events": {
                    "blur": function(){this.setStyles(_self.css.inforContentInputNode);},
                    "focus": function(){this.setStyles(_self.css.inforContentInputNode_focus);}
                }}).inject(contentNode);

                var lineNode = new Element("div", {"styles": this.css.inforLineNode}).inject(this.inforConfigAreaNode);
                this.saveAction = new Element("div", {"styles": this.css.saveAction, "text": this.lp.saveInfor}).inject(lineNode);
                this.saveAction.addEvent("click", function(){
                    this.savePersonInfor();
                }.bind(this));


            }.bind(this), null, this.desktop.session.user.name)
        }.bind(this));
    },
    changeIcon: function(){
        if (!this.uploadFileAreaNode){
            this.uploadFileAreaNode = new Element("div");
            var html = "<input name=\"file\" type=\"file\"/>";
            this.uploadFileAreaNode.set("html", html);

            this.fileUploadNode = this.uploadFileAreaNode.getFirst();
            this.fileUploadNode.addEvent("change", function(){

                var files = fileNode.files;
                if (files.length){
                    for (var i = 0; i < files.length; i++) {
                        var file = files.item(i);

                        var formData = new FormData();
                        formData.append('file', file);
                        //formData.append('name', file.name);
                        //formData.append('folder', folderId);

                        this.action.changeIcon(function(){
                            this.action.getPerson(function(json){
                                if (json.data){
                                    this.personData = json.data;
                                    if (this.personData.icon){
                                        this.contentImgNode.set("src", "data:image/png;base64,"+this.personData.icon);
                                    }
                                }
                            }.bind(this))
                        }.bind(this), null, formData, file);
                    }
                }

            }.bind(this));
        }
        var fileNode = this.uploadFileAreaNode.getFirst();
        fileNode.click();
    },
    savePersonInfor: function(){
        this.personData.display = this.displayInputNode.get("value");
        this.personData.mail = this.mailInputNode.get("value");
        this.personData.mobile = this.mobileInputNode.get("value");
        this.personData.weixin = this.weixinInputNode.get("value");
        this.personData.qq = this.qqInputNode.get("value");
        this.personData.signature = this.signatureInputNode.get("value");
        this.action.updatePerson(this.personData, function(){
            this.notice(this.lp.saveInforOk, "success");
        }.bind(this));
    },
    loadLayoutConfigNode: function(){
        this.layoutConfigNode = new Element("div", {"styles": this.css.configNode}).inject(this.content);
        this.clearDataAction = new Element("div", {"styles": this.css.clearDataAction, "text": this.lp.clear}).inject(this.layoutConfigNode);
        this.clearDataAction.addEvent("click", function(){
            MWF.require("MWF.widget.UUID", function(){
                MWF.UD.putData("layout", {}, function(){
                    this.notice(this.lp.clearok, "success");
                    this.desktop.notRecordStatus = true;
                }.bind(this));
            }.bind(this));
        }.bind(this));

        if (MWF.AC.isAdministrator()){
            this.defaultDataAction = new Element("div", {"styles": this.css.setDefaultDataAction, "text": this.lp.setDefault}).inject(this.layoutConfigNode);
            this.defaultDataAction.addEvent("click", function(){
                MWF.require("MWF.widget.UUID", function(){
                    var text = this.lp.setDefaultOk;
                    this.close();
                    var status = layout.desktop.getLayoutStatusData();
                    MWF.UD.putPublicData("defaultLayout", status, function(){
                        MWF.xDesktop.notice("success", {"x": "right", "y": "top"}, text, layout.desktop.desktopNode);
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }
    },
    loadIdeaConfigNode: function(){
        this.ideaConfigNode = new Element("div", {"styles": this.css.configNode}).inject(this.content);;
        this.ideasArea = new Element("textarea", {"styles": this.css.ideasArea}).inject(this.ideaConfigNode);
        this.ideasSaveAction = new Element("div", {"styles": this.css.ideasSaveAction, "text": this.lp.saveIdea}).inject(this.ideaConfigNode);

        if (MWF.AC.isAdministrator()){
            this.ideasSaveDefaultAction = new Element("div", {"styles": this.css.ideasSaveAction, "text": this.lp.saveIdeaDefault}).inject(this.ideaConfigNode);
            this.ideasSaveDefaultAction.addEvent("click", function(){
                MWF.require("MWF.widget.UUID", function(){
                    var data = {};
                    data.ideas = this.ideasArea.get("value").split("\n");
                    MWF.UD.putPublicData("idea", data, function(){
                        this.notice(this.lp.ideaSaveOk, "success");
                    }.bind(this));
                }.bind(this));
            }.bind(this))
        }

        MWF.require("MWF.widget.UUID", function(){
            MWF.UD.getDataJson("idea", function(json){
                if (json){
                    if (json.ideas) this.ideasArea.set("value", json.ideas.join("\n"));
                }
            }.bind(this));
        }.bind(this));

        this.ideasSaveAction.addEvent("click", function(){
            MWF.require("MWF.widget.UUID", function(){
                var data = {};
                data.ideas = this.ideasArea.get("value").split("\n");
                MWF.UD.putData("idea", data, function(){
                    this.notice(this.lp.ideaSaveOk, "success");
                }.bind(this));
            }.bind(this));
        }.bind(this))
    },
    loadPasswordConfigNode: function(){
        this.passwordConfigNode = new Element("div", {"styles": this.css.configNode});
        this.passwordConfigAreaNode = new Element("div", {"styles": this.css.inforConfigAreaNode}).inject(this.passwordConfigNode);

        var _self = this;
        var lineNode = new Element("div", {"styles": this.css.inforLineNode}).inject(this.passwordConfigAreaNode);
        var titleNode = new Element("div", {"styles": this.css.inforTitleNode, "text": this.lp.oldPassword}).inject(lineNode);
        var contentNode = new Element("div", {"styles": this.css.inforContentNode}).inject(lineNode);
        this.oldPasswordInputNode = new Element("input", {"type": "password", "styles": this.css.inforContentInputNode, "events": {
            "blur": function(){this.setStyles(_self.css.inforContentInputNode);},
            "focus": function(){this.setStyles(_self.css.inforContentInputNode_focus);}
        }}).inject(contentNode);

        var lineNode = new Element("div", {"styles": this.css.inforLineNode}).inject(this.passwordConfigAreaNode);
        var titleNode = new Element("div", {"styles": this.css.inforTitleNode, "text": this.lp.password}).inject(lineNode);
        var contentNode = new Element("div", {"styles": this.css.inforContentNode}).inject(lineNode);
        this.passwordInputNode = new Element("input", {"type": "password", "styles": this.css.inforContentInputNode, "events": {
            "blur": function(){this.setStyles(_self.css.inforContentInputNode);},
            "focus": function(){this.setStyles(_self.css.inforContentInputNode_focus);}
        }}).inject(contentNode);

        var lineNode = new Element("div", {"styles": this.css.inforLineNode}).inject(this.passwordConfigAreaNode);
        var titleNode = new Element("div", {"styles": this.css.inforTitleNode, "text": this.lp.morePassword}).inject(lineNode);
        var contentNode = new Element("div", {"styles": this.css.inforContentNode}).inject(lineNode);
        this.morePasswordInputNode = new Element("input", {"type": "password", "styles": this.css.inforContentInputNode, "events": {
            "blur": function(){this.setStyles(_self.css.inforContentInputNode);},
            "focus": function(){this.setStyles(_self.css.inforContentInputNode_focus);}
        }}).inject(contentNode);

        var lineNode = new Element("div", {"styles": this.css.inforLineNode}).inject(this.passwordConfigAreaNode);
        this.saveAction = new Element("div", {"styles": this.css.saveAction, "text": this.lp.passwordConfig}).inject(lineNode);
        this.saveAction.addEvent("click", function(){
            this.changePassword();
        }.bind(this));

    },
    changePassword: function(){
        var oldPassword = this.oldPasswordInputNode.get("value");
        var password = this.passwordInputNode.get("value");
        var morePassword = this.morePasswordInputNode.get("value");

        if (password!=morePassword){
            this.notice(this.lp.passwordNotMatch, "error");
            this.passwordInputNode.setStyles(this.css.inforContentInputNode_error);
            this.morePasswordInputNode.setStyles(this.css.inforContentInputNode_error);
        }else{
            this.action.changePassword(oldPassword, password, morePassword, function(){
                this.oldPasswordInputNode.set("value", "");
                this.passwordInputNode.set("value", "");
                this.morePasswordInputNode.set("value", "");
                this.notice(this.lp.changePasswordOk, "success");
            }.bind(this));

            if (layout.config.mail){
                var url = "http://"+layout.config.mail+"//names.nsf?changepassword&password="+encodeURIComponent(oldPassword)+"&passwordnew="+encodeURIComponent(password)+"&passwordconfirm="+encodeURIComponent(password);
                var iframe = new Element("iframe", {"styles": {"display": "none"}}).inject(this.desktop.desktopNode);
                iframe.set("src", url);
                window.setTimeout(function(){
                    iframe.destroy();
                }.bind(this), 2000);
            }
        }
    },

    getAction: function(callback){
        if (!this.acrion){
            MWF.xDesktop.requireApp("Profile", "Actions.RestActions", function(){
                this.action = new MWF.xApplication.Profile.Actions.RestActions();
                if (callback) callback();
            }.bind(this));
        }else{
            if (callback) callback();
        }
    }
});