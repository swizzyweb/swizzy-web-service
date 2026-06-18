/**
 * HTTP request methods supported by Swizzy web controllers.
 */
export enum RequestMethod {
  /** HTTP GET — retrieve a resource. */
  get = "get",
  /** HTTP POST — create or submit data. */
  post = "post",
  /** HTTP PUT — replace a resource. */
  put = "put",
  /** HTTP DELETE — remove a resource. */
  delete = "delete",
  /** HTTP PATCH — partially update a resource. */
  patch = "patch",
}
