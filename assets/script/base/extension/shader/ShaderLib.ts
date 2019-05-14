import { Shader } from "./Shader";
import * as shaders from "./shaders";


/**
 * Shader库
 */
export interface ShaderMap { [key: string]: Shader }

export class ShaderLib {

    private static _instance: ShaderLib;
    private _shaders: ShaderMap = {};


    private constructor() {
        this.init();
    }


    public static instance() {
        if (!this._instance) {
            this._instance = new ShaderLib();
        }
        return this._instance;
    }


    /**
     * 初始化一些shader实例
     */
    public init() {
        this.addShader(new shaders.Default());
        this.addShader(new shaders.MetaBalls());
        this.addShader(new shaders.CustomMask());
    }


    /**
      * 增加一个新的Shader
      * @param shader 
      */
    public addShader(shader: Shader): boolean {
        if (this._shaders && this._shaders[shader.name]) {
            return false;
        }
        (<any>cc.renderer)._forward._programLib.define(shader.name, shader.vert, shader.frag, shader.defines);
        this._shaders[shader.name] = shader;
        return true;
    }


    /**
    * 取Shader的定义
    * @param name 
    */
    public getShader(name): Shader {
        if (this._shaders[name]) {
            return this._shaders[name]
        }
        throw "ShadlerLib中不存在Shader：" + name;
    }
}

