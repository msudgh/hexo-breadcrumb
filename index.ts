import { register } from "./filter";

/*
 * Register before_post_render filter
 * Ref: https://hexo.io/api/filter#before-post-render
 */
hexo.extend.filter.register(
  "before_post_render",
  register,
);
