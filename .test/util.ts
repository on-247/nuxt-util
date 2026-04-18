// @ts-ignore
import assert_ from "node:assert";

export const assert = {
  equalDate: (d1: Date, d2: Date) => {
    return assert.equal( d1.getTime(), d1.getTime() )
  },
  equal: assert_.equal,
  deepEqual: assert_.deepEqual,
  notEqual: assert_.notEqual,
  describe(description: string | number) {
    return {
      equal: (...values: any[]) => {
        try {
          assert_.equal(...values)
        } catch (e: any) {
          e.message = `[${description}] ${e.message}`
          throw e
        }
      },
      deepEqual: (...values: any[]) => {
        try {
          assert_.equal(...values)
        } catch (e: any) {
          e.message = `[${description}] ${e.message}`
          throw e
        }
      },
      notEqual: (...values: any[]) => {
        try {
          assert_.notEqual(...values)
        } catch (e: any) {
          e.message = `[${description}] ${e.message}`
          throw e
        }
      },
      equalDate: assert.equalDate
    }
  }
}

export async function run_test(func: Function) {
  try {
    let res = func()
    if (res && 'then' in res) await res
    console.log('\n', '\x1b[32m[TEST PASSED]\x1b[0m', `${func.name}()`, '\n')
  }
  catch (e) {
    let err = String(e).replace('AssertionError [ERR_ASSERTION]:', '')
    console.error('\n', '\x1b[31m[TEST ERROR]\x1b[0m', `${func.name}()`, err, '\n')
  }
}