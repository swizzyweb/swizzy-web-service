export interface StateConverterProps<IN_STATE> {
  state: IN_STATE;
  [key: string]: any;
}

export type StateConverter<IN_STATE, OUT_STATE> = (
  props: StateConverterProps<IN_STATE>,
) => Promise<OUT_STATE>;

export async function DefaultStateExporter<IN_STATE, OUT_STATE>(
  inState: StateConverterProps<IN_STATE>,
): Promise<OUT_STATE> {
  const { state } = inState;
  return state as any as OUT_STATE;
}

export async function InheritedStateExporter<
  IN_STATE extends OUT_STATE,
  OUT_STATE,
>(inState: StateConverterProps<IN_STATE>): Promise<OUT_STATE> {
  const { state } = inState;
  return { ...state };
}
