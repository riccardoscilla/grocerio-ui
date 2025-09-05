import { DataState } from "./dataState"

export class DataStateHandler {
  private states = new Map<DataState<any>, DataState<any>>();

  add<T>(obj: DataState<T>) {
    this.states.set(obj, obj);
  }

  addAndLoading<T>(obj: DataState<T>) {
    obj.setLoading();
    this.states.set(obj, obj);
  }

  setSuccess<T>(obj: DataState<T>) {
    const state = this.states.get(obj);
    state?.setSuccess();
  }

  setError<T>(obj: DataState<T>) {
    const state = this.states.get(obj);
    state?.setError();
  }

  isLoading(): boolean {
    return Array.from(this.states.values()).some(value => value.getStatus()() === 'loading');
  }

  isSuccess(): boolean {
    return Array.from(this.states.values()).every(value => value.getStatus()() === 'success');
  }

  isError(): boolean {
    return Array.from(this.states.values()).some(value => value.getStatus()() === 'error');
  }
}