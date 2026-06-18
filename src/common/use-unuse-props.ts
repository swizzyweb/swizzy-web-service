/**
 * Base props shared by use/unuse (mount/unmount) operations.
 * @template INSTANCE the router or controller instance being managed
 */
export interface IBaseUseUnuseProps<INSTANCE> {
  /** The instance to mount or unmount. */
  instance: INSTANCE;
}

