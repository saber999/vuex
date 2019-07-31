let Vue;
const forEach = (obj,cal)=>{
    Object.keys(obj).forEach(key=>{
        cal(key,obj[key])
    })
}
class ModuleCollection{
    constructor(options){
        this.register([],options);
    }
    register(path,rootModule){
        let newModule = {
            _raw:rootModule,
            _children:{},
            state:rootModule.state
        }
        if(path.length == 0){
            this.root = newModule
        }else{
            console.log(path)
            let parent = path.slice(0,-1).reduce((root,current)=>{
                return this.root._children[current]
            },this.root)
            console.log(parent,'test')
            parent._children[path[path.length-1]] = newModule
        }
        if(rootModule.modules){
            forEach(rootModule.modules,(moduleName,module)=>{
                this.register(path.concat(moduleName),module)
            })
        }
    }
}
//递归树结构，将结果挂载到 getters mutations actions
const installModule =(store,state,path,rootModule)=>{
    if(path.length>0){
        //子模块的状态放到父模块
        let parent = path.slice(0,-1).reduce((state, current)=>{
            return state[current]
        }, state)
        Vue.set(parent, path[path.length-1],rootModule.state)
    }
    let getters = rootModule._raw.getters
    if(getters){//给store
        forEach(getters,(gettersName,fn)=>{
            Object.defineProperty(store.getters,gettersName,{
                get:()=>{
                    return fn(rootModule.state);
                }
            })
        })
    }
    let mutations = rootModule._raw.mutations;
    if(mutations){
        forEach(mutations,(mutationsName,fn)=>{
           let arr = store.mutations[mutationsName] || (store.mutations[mutationsName]=[]);
            arr.push((payload)=>{
                fn(rootModule.state,payload)
            })
        })
    }
    let actions = rootModule._raw.actions;
    if(actions){
        forEach(actions,(actionsName,fn)=>{
           let arr = store.actions[actionsName] || (store.actions[actionsName]=[]);
            arr.push((payload)=>{
                fn(state,payload)
            })
        })
    }
    forEach(rootModule._children,(moduleName,module)=>{
        installModule(store,state,path.concat(moduleName),module)
    })
}
class Store{
    constructor(options){
        this._s = new Vue ({
            data:{state:options.state}
        });

        // let getters = options.getters || {};
        console.log(options)
        this.getters = {};
        // forEach(getters,(gettersName,fn)=>{
        //     Object.defineProperty(this.getters,gettersName,{
        //         get:()=>{
        //             return fn(this.state)
        //         }
        //     })
        // })

        // let mutations = options.mutations || {};
        this.mutations ={};
        //典型的发布订阅
        // forEach(mutations,(mutationsName,value)=>{
        //    this.mutations[mutationsName] = (payload)=>{
        //        value(this.state,payload)
        //    }
        // })

        // let actions = options.actions || {}
        this.actions = {}
        // forEach(actions,(actionsName,fn)=>{
        //     this.actions[actionsName] = (payload)=>{
        //         fn(this,payload)
        //     }
        // })
        //yuanma中的写法
        // let {dispatch,commit}= this;
        // this.dispatch = ()=>{
        //     dispatch.call(this)
        // }
        // this.commit = function(){
            
        // }
        //格式化模块数据
        this.modules = new ModuleCollection(options);
        //this.$store包含getters mutaions
        installModule(this, this.state,[], this.modules.root);
        console.log(this.modules)
        // let root ={
        //     _raw:rootModule,
        //     state:rootModule.state,
        //     _children:{
        //         a:{
        //             _raw:rootModule,
        //             state:rootModule.state,
        //             state:{x:1}
        //         },
        //         b:{
        //             _raw:rootModule,
        //             state:rootModule.state,
        //             state:{y:1}
        //         }
        //     }
        // }
    }
    get state(){
        return this._s.state
    }
    commit=(type,payload)=>{
        console.log(this.mutations)
        debugger
        this.mutations[type].forEach(fn=>{
            fn(payload)
        })
    }
    dispatch=(type,payload)=>{
        //这里的this有坑
        this.actions[type].forEach(fn=>{
            fn(payload)
        })
    }
}
const install = (_Vue)=>{
    Vue = _Vue;
    //给每个组件注册$store
    Vue.mixin({
        beforeCreate() {
            console.log(this.$options)
            //一开始只是作为参数传到了组件中，并没有挂载到组件的实例上。

            if(this.$options && this.$options.store){
                this.$store = this.$options.store
            }else{
                this.$store = this.$parent && this.$parent.$store
            }
        },
    })
}
export default {
    install,
    Store
}