"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filter_1 = require("./filter");
/*
 * Register before_post_render filter
 * Ref: https://hexo.io/api/filter#before-post-render
 */
hexo.extend.filter.register("before_post_render", filter_1.register);
