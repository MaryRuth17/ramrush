
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model MemorySession
 * 
 */
export type MemorySession = $Result.DefaultSelection<Prisma.$MemorySessionPayload>
/**
 * Model CpuSession
 * 
 */
export type CpuSession = $Result.DefaultSelection<Prisma.$CpuSessionPayload>
/**
 * Model VmSession
 * 
 */
export type VmSession = $Result.DefaultSelection<Prisma.$VmSessionPayload>
/**
 * Model DiskSession
 * 
 */
export type DiskSession = $Result.DefaultSelection<Prisma.$DiskSessionPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more MemorySessions
 * const memorySessions = await prisma.memorySession.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more MemorySessions
   * const memorySessions = await prisma.memorySession.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.memorySession`: Exposes CRUD operations for the **MemorySession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MemorySessions
    * const memorySessions = await prisma.memorySession.findMany()
    * ```
    */
  get memorySession(): Prisma.MemorySessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cpuSession`: Exposes CRUD operations for the **CpuSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CpuSessions
    * const cpuSessions = await prisma.cpuSession.findMany()
    * ```
    */
  get cpuSession(): Prisma.CpuSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vmSession`: Exposes CRUD operations for the **VmSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VmSessions
    * const vmSessions = await prisma.vmSession.findMany()
    * ```
    */
  get vmSession(): Prisma.VmSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.diskSession`: Exposes CRUD operations for the **DiskSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DiskSessions
    * const diskSessions = await prisma.diskSession.findMany()
    * ```
    */
  get diskSession(): Prisma.DiskSessionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    MemorySession: 'MemorySession',
    CpuSession: 'CpuSession',
    VmSession: 'VmSession',
    DiskSession: 'DiskSession'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "memorySession" | "cpuSession" | "vmSession" | "diskSession"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      MemorySession: {
        payload: Prisma.$MemorySessionPayload<ExtArgs>
        fields: Prisma.MemorySessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MemorySessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MemorySessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>
          }
          findFirst: {
            args: Prisma.MemorySessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MemorySessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>
          }
          findMany: {
            args: Prisma.MemorySessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>[]
          }
          create: {
            args: Prisma.MemorySessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>
          }
          createMany: {
            args: Prisma.MemorySessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MemorySessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>[]
          }
          delete: {
            args: Prisma.MemorySessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>
          }
          update: {
            args: Prisma.MemorySessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>
          }
          deleteMany: {
            args: Prisma.MemorySessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MemorySessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MemorySessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>[]
          }
          upsert: {
            args: Prisma.MemorySessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MemorySessionPayload>
          }
          aggregate: {
            args: Prisma.MemorySessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMemorySession>
          }
          groupBy: {
            args: Prisma.MemorySessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<MemorySessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.MemorySessionCountArgs<ExtArgs>
            result: $Utils.Optional<MemorySessionCountAggregateOutputType> | number
          }
        }
      }
      CpuSession: {
        payload: Prisma.$CpuSessionPayload<ExtArgs>
        fields: Prisma.CpuSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CpuSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CpuSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CpuSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CpuSessionPayload>
          }
          findFirst: {
            args: Prisma.CpuSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CpuSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CpuSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CpuSessionPayload>
          }
          findMany: {
            args: Prisma.CpuSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CpuSessionPayload>[]
          }
          create: {
            args: Prisma.CpuSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CpuSessionPayload>
          }
          createMany: {
            args: Prisma.CpuSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CpuSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CpuSessionPayload>[]
          }
          delete: {
            args: Prisma.CpuSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CpuSessionPayload>
          }
          update: {
            args: Prisma.CpuSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CpuSessionPayload>
          }
          deleteMany: {
            args: Prisma.CpuSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CpuSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CpuSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CpuSessionPayload>[]
          }
          upsert: {
            args: Prisma.CpuSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CpuSessionPayload>
          }
          aggregate: {
            args: Prisma.CpuSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCpuSession>
          }
          groupBy: {
            args: Prisma.CpuSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CpuSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CpuSessionCountArgs<ExtArgs>
            result: $Utils.Optional<CpuSessionCountAggregateOutputType> | number
          }
        }
      }
      VmSession: {
        payload: Prisma.$VmSessionPayload<ExtArgs>
        fields: Prisma.VmSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VmSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VmSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VmSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VmSessionPayload>
          }
          findFirst: {
            args: Prisma.VmSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VmSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VmSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VmSessionPayload>
          }
          findMany: {
            args: Prisma.VmSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VmSessionPayload>[]
          }
          create: {
            args: Prisma.VmSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VmSessionPayload>
          }
          createMany: {
            args: Prisma.VmSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VmSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VmSessionPayload>[]
          }
          delete: {
            args: Prisma.VmSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VmSessionPayload>
          }
          update: {
            args: Prisma.VmSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VmSessionPayload>
          }
          deleteMany: {
            args: Prisma.VmSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VmSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VmSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VmSessionPayload>[]
          }
          upsert: {
            args: Prisma.VmSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VmSessionPayload>
          }
          aggregate: {
            args: Prisma.VmSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVmSession>
          }
          groupBy: {
            args: Prisma.VmSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<VmSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.VmSessionCountArgs<ExtArgs>
            result: $Utils.Optional<VmSessionCountAggregateOutputType> | number
          }
        }
      }
      DiskSession: {
        payload: Prisma.$DiskSessionPayload<ExtArgs>
        fields: Prisma.DiskSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DiskSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiskSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DiskSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiskSessionPayload>
          }
          findFirst: {
            args: Prisma.DiskSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiskSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DiskSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiskSessionPayload>
          }
          findMany: {
            args: Prisma.DiskSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiskSessionPayload>[]
          }
          create: {
            args: Prisma.DiskSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiskSessionPayload>
          }
          createMany: {
            args: Prisma.DiskSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DiskSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiskSessionPayload>[]
          }
          delete: {
            args: Prisma.DiskSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiskSessionPayload>
          }
          update: {
            args: Prisma.DiskSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiskSessionPayload>
          }
          deleteMany: {
            args: Prisma.DiskSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DiskSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DiskSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiskSessionPayload>[]
          }
          upsert: {
            args: Prisma.DiskSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiskSessionPayload>
          }
          aggregate: {
            args: Prisma.DiskSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDiskSession>
          }
          groupBy: {
            args: Prisma.DiskSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<DiskSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.DiskSessionCountArgs<ExtArgs>
            result: $Utils.Optional<DiskSessionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    memorySession?: MemorySessionOmit
    cpuSession?: CpuSessionOmit
    vmSession?: VmSessionOmit
    diskSession?: DiskSessionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model MemorySession
   */

  export type AggregateMemorySession = {
    _count: MemorySessionCountAggregateOutputType | null
    _avg: MemorySessionAvgAggregateOutputType | null
    _sum: MemorySessionSumAggregateOutputType | null
    _min: MemorySessionMinAggregateOutputType | null
    _max: MemorySessionMaxAggregateOutputType | null
  }

  export type MemorySessionAvgAggregateOutputType = {
    id: number | null
    score: number | null
    hearts: number | null
    processed: number | null
    unprocessed: number | null
  }

  export type MemorySessionSumAggregateOutputType = {
    id: number | null
    score: number | null
    hearts: number | null
    processed: number | null
    unprocessed: number | null
  }

  export type MemorySessionMinAggregateOutputType = {
    id: number | null
    algorithm: string | null
    stageType: string | null
    mode: string | null
    score: number | null
    hearts: number | null
    processed: number | null
    unprocessed: number | null
    createdAt: Date | null
  }

  export type MemorySessionMaxAggregateOutputType = {
    id: number | null
    algorithm: string | null
    stageType: string | null
    mode: string | null
    score: number | null
    hearts: number | null
    processed: number | null
    unprocessed: number | null
    createdAt: Date | null
  }

  export type MemorySessionCountAggregateOutputType = {
    id: number
    algorithm: number
    stageType: number
    mode: number
    score: number
    hearts: number
    processed: number
    unprocessed: number
    createdAt: number
    _all: number
  }


  export type MemorySessionAvgAggregateInputType = {
    id?: true
    score?: true
    hearts?: true
    processed?: true
    unprocessed?: true
  }

  export type MemorySessionSumAggregateInputType = {
    id?: true
    score?: true
    hearts?: true
    processed?: true
    unprocessed?: true
  }

  export type MemorySessionMinAggregateInputType = {
    id?: true
    algorithm?: true
    stageType?: true
    mode?: true
    score?: true
    hearts?: true
    processed?: true
    unprocessed?: true
    createdAt?: true
  }

  export type MemorySessionMaxAggregateInputType = {
    id?: true
    algorithm?: true
    stageType?: true
    mode?: true
    score?: true
    hearts?: true
    processed?: true
    unprocessed?: true
    createdAt?: true
  }

  export type MemorySessionCountAggregateInputType = {
    id?: true
    algorithm?: true
    stageType?: true
    mode?: true
    score?: true
    hearts?: true
    processed?: true
    unprocessed?: true
    createdAt?: true
    _all?: true
  }

  export type MemorySessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MemorySession to aggregate.
     */
    where?: MemorySessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MemorySessions to fetch.
     */
    orderBy?: MemorySessionOrderByWithRelationInput | MemorySessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MemorySessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MemorySessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MemorySessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MemorySessions
    **/
    _count?: true | MemorySessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MemorySessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MemorySessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MemorySessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MemorySessionMaxAggregateInputType
  }

  export type GetMemorySessionAggregateType<T extends MemorySessionAggregateArgs> = {
        [P in keyof T & keyof AggregateMemorySession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMemorySession[P]>
      : GetScalarType<T[P], AggregateMemorySession[P]>
  }




  export type MemorySessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MemorySessionWhereInput
    orderBy?: MemorySessionOrderByWithAggregationInput | MemorySessionOrderByWithAggregationInput[]
    by: MemorySessionScalarFieldEnum[] | MemorySessionScalarFieldEnum
    having?: MemorySessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MemorySessionCountAggregateInputType | true
    _avg?: MemorySessionAvgAggregateInputType
    _sum?: MemorySessionSumAggregateInputType
    _min?: MemorySessionMinAggregateInputType
    _max?: MemorySessionMaxAggregateInputType
  }

  export type MemorySessionGroupByOutputType = {
    id: number
    algorithm: string
    stageType: string | null
    mode: string
    score: number
    hearts: number
    processed: number
    unprocessed: number
    createdAt: Date
    _count: MemorySessionCountAggregateOutputType | null
    _avg: MemorySessionAvgAggregateOutputType | null
    _sum: MemorySessionSumAggregateOutputType | null
    _min: MemorySessionMinAggregateOutputType | null
    _max: MemorySessionMaxAggregateOutputType | null
  }

  type GetMemorySessionGroupByPayload<T extends MemorySessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MemorySessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MemorySessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MemorySessionGroupByOutputType[P]>
            : GetScalarType<T[P], MemorySessionGroupByOutputType[P]>
        }
      >
    >


  export type MemorySessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    algorithm?: boolean
    stageType?: boolean
    mode?: boolean
    score?: boolean
    hearts?: boolean
    processed?: boolean
    unprocessed?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["memorySession"]>

  export type MemorySessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    algorithm?: boolean
    stageType?: boolean
    mode?: boolean
    score?: boolean
    hearts?: boolean
    processed?: boolean
    unprocessed?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["memorySession"]>

  export type MemorySessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    algorithm?: boolean
    stageType?: boolean
    mode?: boolean
    score?: boolean
    hearts?: boolean
    processed?: boolean
    unprocessed?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["memorySession"]>

  export type MemorySessionSelectScalar = {
    id?: boolean
    algorithm?: boolean
    stageType?: boolean
    mode?: boolean
    score?: boolean
    hearts?: boolean
    processed?: boolean
    unprocessed?: boolean
    createdAt?: boolean
  }

  export type MemorySessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "algorithm" | "stageType" | "mode" | "score" | "hearts" | "processed" | "unprocessed" | "createdAt", ExtArgs["result"]["memorySession"]>

  export type $MemorySessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MemorySession"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      algorithm: string
      stageType: string | null
      mode: string
      score: number
      hearts: number
      processed: number
      unprocessed: number
      createdAt: Date
    }, ExtArgs["result"]["memorySession"]>
    composites: {}
  }

  type MemorySessionGetPayload<S extends boolean | null | undefined | MemorySessionDefaultArgs> = $Result.GetResult<Prisma.$MemorySessionPayload, S>

  type MemorySessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MemorySessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MemorySessionCountAggregateInputType | true
    }

  export interface MemorySessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MemorySession'], meta: { name: 'MemorySession' } }
    /**
     * Find zero or one MemorySession that matches the filter.
     * @param {MemorySessionFindUniqueArgs} args - Arguments to find a MemorySession
     * @example
     * // Get one MemorySession
     * const memorySession = await prisma.memorySession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MemorySessionFindUniqueArgs>(args: SelectSubset<T, MemorySessionFindUniqueArgs<ExtArgs>>): Prisma__MemorySessionClient<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MemorySession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MemorySessionFindUniqueOrThrowArgs} args - Arguments to find a MemorySession
     * @example
     * // Get one MemorySession
     * const memorySession = await prisma.memorySession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MemorySessionFindUniqueOrThrowArgs>(args: SelectSubset<T, MemorySessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MemorySessionClient<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MemorySession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemorySessionFindFirstArgs} args - Arguments to find a MemorySession
     * @example
     * // Get one MemorySession
     * const memorySession = await prisma.memorySession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MemorySessionFindFirstArgs>(args?: SelectSubset<T, MemorySessionFindFirstArgs<ExtArgs>>): Prisma__MemorySessionClient<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MemorySession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemorySessionFindFirstOrThrowArgs} args - Arguments to find a MemorySession
     * @example
     * // Get one MemorySession
     * const memorySession = await prisma.memorySession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MemorySessionFindFirstOrThrowArgs>(args?: SelectSubset<T, MemorySessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__MemorySessionClient<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MemorySessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemorySessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MemorySessions
     * const memorySessions = await prisma.memorySession.findMany()
     * 
     * // Get first 10 MemorySessions
     * const memorySessions = await prisma.memorySession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const memorySessionWithIdOnly = await prisma.memorySession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MemorySessionFindManyArgs>(args?: SelectSubset<T, MemorySessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MemorySession.
     * @param {MemorySessionCreateArgs} args - Arguments to create a MemorySession.
     * @example
     * // Create one MemorySession
     * const MemorySession = await prisma.memorySession.create({
     *   data: {
     *     // ... data to create a MemorySession
     *   }
     * })
     * 
     */
    create<T extends MemorySessionCreateArgs>(args: SelectSubset<T, MemorySessionCreateArgs<ExtArgs>>): Prisma__MemorySessionClient<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MemorySessions.
     * @param {MemorySessionCreateManyArgs} args - Arguments to create many MemorySessions.
     * @example
     * // Create many MemorySessions
     * const memorySession = await prisma.memorySession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MemorySessionCreateManyArgs>(args?: SelectSubset<T, MemorySessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MemorySessions and returns the data saved in the database.
     * @param {MemorySessionCreateManyAndReturnArgs} args - Arguments to create many MemorySessions.
     * @example
     * // Create many MemorySessions
     * const memorySession = await prisma.memorySession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MemorySessions and only return the `id`
     * const memorySessionWithIdOnly = await prisma.memorySession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MemorySessionCreateManyAndReturnArgs>(args?: SelectSubset<T, MemorySessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MemorySession.
     * @param {MemorySessionDeleteArgs} args - Arguments to delete one MemorySession.
     * @example
     * // Delete one MemorySession
     * const MemorySession = await prisma.memorySession.delete({
     *   where: {
     *     // ... filter to delete one MemorySession
     *   }
     * })
     * 
     */
    delete<T extends MemorySessionDeleteArgs>(args: SelectSubset<T, MemorySessionDeleteArgs<ExtArgs>>): Prisma__MemorySessionClient<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MemorySession.
     * @param {MemorySessionUpdateArgs} args - Arguments to update one MemorySession.
     * @example
     * // Update one MemorySession
     * const memorySession = await prisma.memorySession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MemorySessionUpdateArgs>(args: SelectSubset<T, MemorySessionUpdateArgs<ExtArgs>>): Prisma__MemorySessionClient<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MemorySessions.
     * @param {MemorySessionDeleteManyArgs} args - Arguments to filter MemorySessions to delete.
     * @example
     * // Delete a few MemorySessions
     * const { count } = await prisma.memorySession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MemorySessionDeleteManyArgs>(args?: SelectSubset<T, MemorySessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MemorySessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemorySessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MemorySessions
     * const memorySession = await prisma.memorySession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MemorySessionUpdateManyArgs>(args: SelectSubset<T, MemorySessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MemorySessions and returns the data updated in the database.
     * @param {MemorySessionUpdateManyAndReturnArgs} args - Arguments to update many MemorySessions.
     * @example
     * // Update many MemorySessions
     * const memorySession = await prisma.memorySession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MemorySessions and only return the `id`
     * const memorySessionWithIdOnly = await prisma.memorySession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MemorySessionUpdateManyAndReturnArgs>(args: SelectSubset<T, MemorySessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MemorySession.
     * @param {MemorySessionUpsertArgs} args - Arguments to update or create a MemorySession.
     * @example
     * // Update or create a MemorySession
     * const memorySession = await prisma.memorySession.upsert({
     *   create: {
     *     // ... data to create a MemorySession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MemorySession we want to update
     *   }
     * })
     */
    upsert<T extends MemorySessionUpsertArgs>(args: SelectSubset<T, MemorySessionUpsertArgs<ExtArgs>>): Prisma__MemorySessionClient<$Result.GetResult<Prisma.$MemorySessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MemorySessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemorySessionCountArgs} args - Arguments to filter MemorySessions to count.
     * @example
     * // Count the number of MemorySessions
     * const count = await prisma.memorySession.count({
     *   where: {
     *     // ... the filter for the MemorySessions we want to count
     *   }
     * })
    **/
    count<T extends MemorySessionCountArgs>(
      args?: Subset<T, MemorySessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MemorySessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MemorySession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemorySessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MemorySessionAggregateArgs>(args: Subset<T, MemorySessionAggregateArgs>): Prisma.PrismaPromise<GetMemorySessionAggregateType<T>>

    /**
     * Group by MemorySession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MemorySessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MemorySessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MemorySessionGroupByArgs['orderBy'] }
        : { orderBy?: MemorySessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MemorySessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMemorySessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MemorySession model
   */
  readonly fields: MemorySessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MemorySession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MemorySessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MemorySession model
   */
  interface MemorySessionFieldRefs {
    readonly id: FieldRef<"MemorySession", 'Int'>
    readonly algorithm: FieldRef<"MemorySession", 'String'>
    readonly stageType: FieldRef<"MemorySession", 'String'>
    readonly mode: FieldRef<"MemorySession", 'String'>
    readonly score: FieldRef<"MemorySession", 'Int'>
    readonly hearts: FieldRef<"MemorySession", 'Int'>
    readonly processed: FieldRef<"MemorySession", 'Int'>
    readonly unprocessed: FieldRef<"MemorySession", 'Int'>
    readonly createdAt: FieldRef<"MemorySession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MemorySession findUnique
   */
  export type MemorySessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * Filter, which MemorySession to fetch.
     */
    where: MemorySessionWhereUniqueInput
  }

  /**
   * MemorySession findUniqueOrThrow
   */
  export type MemorySessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * Filter, which MemorySession to fetch.
     */
    where: MemorySessionWhereUniqueInput
  }

  /**
   * MemorySession findFirst
   */
  export type MemorySessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * Filter, which MemorySession to fetch.
     */
    where?: MemorySessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MemorySessions to fetch.
     */
    orderBy?: MemorySessionOrderByWithRelationInput | MemorySessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MemorySessions.
     */
    cursor?: MemorySessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MemorySessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MemorySessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MemorySessions.
     */
    distinct?: MemorySessionScalarFieldEnum | MemorySessionScalarFieldEnum[]
  }

  /**
   * MemorySession findFirstOrThrow
   */
  export type MemorySessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * Filter, which MemorySession to fetch.
     */
    where?: MemorySessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MemorySessions to fetch.
     */
    orderBy?: MemorySessionOrderByWithRelationInput | MemorySessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MemorySessions.
     */
    cursor?: MemorySessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MemorySessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MemorySessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MemorySessions.
     */
    distinct?: MemorySessionScalarFieldEnum | MemorySessionScalarFieldEnum[]
  }

  /**
   * MemorySession findMany
   */
  export type MemorySessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * Filter, which MemorySessions to fetch.
     */
    where?: MemorySessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MemorySessions to fetch.
     */
    orderBy?: MemorySessionOrderByWithRelationInput | MemorySessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MemorySessions.
     */
    cursor?: MemorySessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MemorySessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MemorySessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MemorySessions.
     */
    distinct?: MemorySessionScalarFieldEnum | MemorySessionScalarFieldEnum[]
  }

  /**
   * MemorySession create
   */
  export type MemorySessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * The data needed to create a MemorySession.
     */
    data: XOR<MemorySessionCreateInput, MemorySessionUncheckedCreateInput>
  }

  /**
   * MemorySession createMany
   */
  export type MemorySessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MemorySessions.
     */
    data: MemorySessionCreateManyInput | MemorySessionCreateManyInput[]
  }

  /**
   * MemorySession createManyAndReturn
   */
  export type MemorySessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * The data used to create many MemorySessions.
     */
    data: MemorySessionCreateManyInput | MemorySessionCreateManyInput[]
  }

  /**
   * MemorySession update
   */
  export type MemorySessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * The data needed to update a MemorySession.
     */
    data: XOR<MemorySessionUpdateInput, MemorySessionUncheckedUpdateInput>
    /**
     * Choose, which MemorySession to update.
     */
    where: MemorySessionWhereUniqueInput
  }

  /**
   * MemorySession updateMany
   */
  export type MemorySessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MemorySessions.
     */
    data: XOR<MemorySessionUpdateManyMutationInput, MemorySessionUncheckedUpdateManyInput>
    /**
     * Filter which MemorySessions to update
     */
    where?: MemorySessionWhereInput
    /**
     * Limit how many MemorySessions to update.
     */
    limit?: number
  }

  /**
   * MemorySession updateManyAndReturn
   */
  export type MemorySessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * The data used to update MemorySessions.
     */
    data: XOR<MemorySessionUpdateManyMutationInput, MemorySessionUncheckedUpdateManyInput>
    /**
     * Filter which MemorySessions to update
     */
    where?: MemorySessionWhereInput
    /**
     * Limit how many MemorySessions to update.
     */
    limit?: number
  }

  /**
   * MemorySession upsert
   */
  export type MemorySessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * The filter to search for the MemorySession to update in case it exists.
     */
    where: MemorySessionWhereUniqueInput
    /**
     * In case the MemorySession found by the `where` argument doesn't exist, create a new MemorySession with this data.
     */
    create: XOR<MemorySessionCreateInput, MemorySessionUncheckedCreateInput>
    /**
     * In case the MemorySession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MemorySessionUpdateInput, MemorySessionUncheckedUpdateInput>
  }

  /**
   * MemorySession delete
   */
  export type MemorySessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
    /**
     * Filter which MemorySession to delete.
     */
    where: MemorySessionWhereUniqueInput
  }

  /**
   * MemorySession deleteMany
   */
  export type MemorySessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MemorySessions to delete
     */
    where?: MemorySessionWhereInput
    /**
     * Limit how many MemorySessions to delete.
     */
    limit?: number
  }

  /**
   * MemorySession without action
   */
  export type MemorySessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MemorySession
     */
    select?: MemorySessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MemorySession
     */
    omit?: MemorySessionOmit<ExtArgs> | null
  }


  /**
   * Model CpuSession
   */

  export type AggregateCpuSession = {
    _count: CpuSessionCountAggregateOutputType | null
    _avg: CpuSessionAvgAggregateOutputType | null
    _sum: CpuSessionSumAggregateOutputType | null
    _min: CpuSessionMinAggregateOutputType | null
    _max: CpuSessionMaxAggregateOutputType | null
  }

  export type CpuSessionAvgAggregateOutputType = {
    id: number | null
    avgWaitingTime: number | null
    avgTurnaround: number | null
    score: number | null
    hearts: number | null
    quantum: number | null
  }

  export type CpuSessionSumAggregateOutputType = {
    id: number | null
    avgWaitingTime: number | null
    avgTurnaround: number | null
    score: number | null
    hearts: number | null
    quantum: number | null
  }

  export type CpuSessionMinAggregateOutputType = {
    id: number | null
    algorithm: string | null
    mode: string | null
    avgWaitingTime: number | null
    avgTurnaround: number | null
    score: number | null
    hearts: number | null
    inputProcesses: string | null
    quantum: number | null
    createdAt: Date | null
  }

  export type CpuSessionMaxAggregateOutputType = {
    id: number | null
    algorithm: string | null
    mode: string | null
    avgWaitingTime: number | null
    avgTurnaround: number | null
    score: number | null
    hearts: number | null
    inputProcesses: string | null
    quantum: number | null
    createdAt: Date | null
  }

  export type CpuSessionCountAggregateOutputType = {
    id: number
    algorithm: number
    mode: number
    avgWaitingTime: number
    avgTurnaround: number
    score: number
    hearts: number
    inputProcesses: number
    quantum: number
    createdAt: number
    _all: number
  }


  export type CpuSessionAvgAggregateInputType = {
    id?: true
    avgWaitingTime?: true
    avgTurnaround?: true
    score?: true
    hearts?: true
    quantum?: true
  }

  export type CpuSessionSumAggregateInputType = {
    id?: true
    avgWaitingTime?: true
    avgTurnaround?: true
    score?: true
    hearts?: true
    quantum?: true
  }

  export type CpuSessionMinAggregateInputType = {
    id?: true
    algorithm?: true
    mode?: true
    avgWaitingTime?: true
    avgTurnaround?: true
    score?: true
    hearts?: true
    inputProcesses?: true
    quantum?: true
    createdAt?: true
  }

  export type CpuSessionMaxAggregateInputType = {
    id?: true
    algorithm?: true
    mode?: true
    avgWaitingTime?: true
    avgTurnaround?: true
    score?: true
    hearts?: true
    inputProcesses?: true
    quantum?: true
    createdAt?: true
  }

  export type CpuSessionCountAggregateInputType = {
    id?: true
    algorithm?: true
    mode?: true
    avgWaitingTime?: true
    avgTurnaround?: true
    score?: true
    hearts?: true
    inputProcesses?: true
    quantum?: true
    createdAt?: true
    _all?: true
  }

  export type CpuSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CpuSession to aggregate.
     */
    where?: CpuSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CpuSessions to fetch.
     */
    orderBy?: CpuSessionOrderByWithRelationInput | CpuSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CpuSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CpuSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CpuSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CpuSessions
    **/
    _count?: true | CpuSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CpuSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CpuSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CpuSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CpuSessionMaxAggregateInputType
  }

  export type GetCpuSessionAggregateType<T extends CpuSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateCpuSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCpuSession[P]>
      : GetScalarType<T[P], AggregateCpuSession[P]>
  }




  export type CpuSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CpuSessionWhereInput
    orderBy?: CpuSessionOrderByWithAggregationInput | CpuSessionOrderByWithAggregationInput[]
    by: CpuSessionScalarFieldEnum[] | CpuSessionScalarFieldEnum
    having?: CpuSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CpuSessionCountAggregateInputType | true
    _avg?: CpuSessionAvgAggregateInputType
    _sum?: CpuSessionSumAggregateInputType
    _min?: CpuSessionMinAggregateInputType
    _max?: CpuSessionMaxAggregateInputType
  }

  export type CpuSessionGroupByOutputType = {
    id: number
    algorithm: string
    mode: string
    avgWaitingTime: number | null
    avgTurnaround: number | null
    score: number
    hearts: number
    inputProcesses: string | null
    quantum: number
    createdAt: Date
    _count: CpuSessionCountAggregateOutputType | null
    _avg: CpuSessionAvgAggregateOutputType | null
    _sum: CpuSessionSumAggregateOutputType | null
    _min: CpuSessionMinAggregateOutputType | null
    _max: CpuSessionMaxAggregateOutputType | null
  }

  type GetCpuSessionGroupByPayload<T extends CpuSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CpuSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CpuSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CpuSessionGroupByOutputType[P]>
            : GetScalarType<T[P], CpuSessionGroupByOutputType[P]>
        }
      >
    >


  export type CpuSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    algorithm?: boolean
    mode?: boolean
    avgWaitingTime?: boolean
    avgTurnaround?: boolean
    score?: boolean
    hearts?: boolean
    inputProcesses?: boolean
    quantum?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["cpuSession"]>

  export type CpuSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    algorithm?: boolean
    mode?: boolean
    avgWaitingTime?: boolean
    avgTurnaround?: boolean
    score?: boolean
    hearts?: boolean
    inputProcesses?: boolean
    quantum?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["cpuSession"]>

  export type CpuSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    algorithm?: boolean
    mode?: boolean
    avgWaitingTime?: boolean
    avgTurnaround?: boolean
    score?: boolean
    hearts?: boolean
    inputProcesses?: boolean
    quantum?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["cpuSession"]>

  export type CpuSessionSelectScalar = {
    id?: boolean
    algorithm?: boolean
    mode?: boolean
    avgWaitingTime?: boolean
    avgTurnaround?: boolean
    score?: boolean
    hearts?: boolean
    inputProcesses?: boolean
    quantum?: boolean
    createdAt?: boolean
  }

  export type CpuSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "algorithm" | "mode" | "avgWaitingTime" | "avgTurnaround" | "score" | "hearts" | "inputProcesses" | "quantum" | "createdAt", ExtArgs["result"]["cpuSession"]>

  export type $CpuSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CpuSession"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      algorithm: string
      mode: string
      avgWaitingTime: number | null
      avgTurnaround: number | null
      score: number
      hearts: number
      inputProcesses: string | null
      quantum: number
      createdAt: Date
    }, ExtArgs["result"]["cpuSession"]>
    composites: {}
  }

  type CpuSessionGetPayload<S extends boolean | null | undefined | CpuSessionDefaultArgs> = $Result.GetResult<Prisma.$CpuSessionPayload, S>

  type CpuSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CpuSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CpuSessionCountAggregateInputType | true
    }

  export interface CpuSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CpuSession'], meta: { name: 'CpuSession' } }
    /**
     * Find zero or one CpuSession that matches the filter.
     * @param {CpuSessionFindUniqueArgs} args - Arguments to find a CpuSession
     * @example
     * // Get one CpuSession
     * const cpuSession = await prisma.cpuSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CpuSessionFindUniqueArgs>(args: SelectSubset<T, CpuSessionFindUniqueArgs<ExtArgs>>): Prisma__CpuSessionClient<$Result.GetResult<Prisma.$CpuSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CpuSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CpuSessionFindUniqueOrThrowArgs} args - Arguments to find a CpuSession
     * @example
     * // Get one CpuSession
     * const cpuSession = await prisma.cpuSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CpuSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, CpuSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CpuSessionClient<$Result.GetResult<Prisma.$CpuSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CpuSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CpuSessionFindFirstArgs} args - Arguments to find a CpuSession
     * @example
     * // Get one CpuSession
     * const cpuSession = await prisma.cpuSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CpuSessionFindFirstArgs>(args?: SelectSubset<T, CpuSessionFindFirstArgs<ExtArgs>>): Prisma__CpuSessionClient<$Result.GetResult<Prisma.$CpuSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CpuSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CpuSessionFindFirstOrThrowArgs} args - Arguments to find a CpuSession
     * @example
     * // Get one CpuSession
     * const cpuSession = await prisma.cpuSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CpuSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, CpuSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CpuSessionClient<$Result.GetResult<Prisma.$CpuSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CpuSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CpuSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CpuSessions
     * const cpuSessions = await prisma.cpuSession.findMany()
     * 
     * // Get first 10 CpuSessions
     * const cpuSessions = await prisma.cpuSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cpuSessionWithIdOnly = await prisma.cpuSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CpuSessionFindManyArgs>(args?: SelectSubset<T, CpuSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CpuSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CpuSession.
     * @param {CpuSessionCreateArgs} args - Arguments to create a CpuSession.
     * @example
     * // Create one CpuSession
     * const CpuSession = await prisma.cpuSession.create({
     *   data: {
     *     // ... data to create a CpuSession
     *   }
     * })
     * 
     */
    create<T extends CpuSessionCreateArgs>(args: SelectSubset<T, CpuSessionCreateArgs<ExtArgs>>): Prisma__CpuSessionClient<$Result.GetResult<Prisma.$CpuSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CpuSessions.
     * @param {CpuSessionCreateManyArgs} args - Arguments to create many CpuSessions.
     * @example
     * // Create many CpuSessions
     * const cpuSession = await prisma.cpuSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CpuSessionCreateManyArgs>(args?: SelectSubset<T, CpuSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CpuSessions and returns the data saved in the database.
     * @param {CpuSessionCreateManyAndReturnArgs} args - Arguments to create many CpuSessions.
     * @example
     * // Create many CpuSessions
     * const cpuSession = await prisma.cpuSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CpuSessions and only return the `id`
     * const cpuSessionWithIdOnly = await prisma.cpuSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CpuSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, CpuSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CpuSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CpuSession.
     * @param {CpuSessionDeleteArgs} args - Arguments to delete one CpuSession.
     * @example
     * // Delete one CpuSession
     * const CpuSession = await prisma.cpuSession.delete({
     *   where: {
     *     // ... filter to delete one CpuSession
     *   }
     * })
     * 
     */
    delete<T extends CpuSessionDeleteArgs>(args: SelectSubset<T, CpuSessionDeleteArgs<ExtArgs>>): Prisma__CpuSessionClient<$Result.GetResult<Prisma.$CpuSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CpuSession.
     * @param {CpuSessionUpdateArgs} args - Arguments to update one CpuSession.
     * @example
     * // Update one CpuSession
     * const cpuSession = await prisma.cpuSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CpuSessionUpdateArgs>(args: SelectSubset<T, CpuSessionUpdateArgs<ExtArgs>>): Prisma__CpuSessionClient<$Result.GetResult<Prisma.$CpuSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CpuSessions.
     * @param {CpuSessionDeleteManyArgs} args - Arguments to filter CpuSessions to delete.
     * @example
     * // Delete a few CpuSessions
     * const { count } = await prisma.cpuSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CpuSessionDeleteManyArgs>(args?: SelectSubset<T, CpuSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CpuSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CpuSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CpuSessions
     * const cpuSession = await prisma.cpuSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CpuSessionUpdateManyArgs>(args: SelectSubset<T, CpuSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CpuSessions and returns the data updated in the database.
     * @param {CpuSessionUpdateManyAndReturnArgs} args - Arguments to update many CpuSessions.
     * @example
     * // Update many CpuSessions
     * const cpuSession = await prisma.cpuSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CpuSessions and only return the `id`
     * const cpuSessionWithIdOnly = await prisma.cpuSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CpuSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, CpuSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CpuSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CpuSession.
     * @param {CpuSessionUpsertArgs} args - Arguments to update or create a CpuSession.
     * @example
     * // Update or create a CpuSession
     * const cpuSession = await prisma.cpuSession.upsert({
     *   create: {
     *     // ... data to create a CpuSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CpuSession we want to update
     *   }
     * })
     */
    upsert<T extends CpuSessionUpsertArgs>(args: SelectSubset<T, CpuSessionUpsertArgs<ExtArgs>>): Prisma__CpuSessionClient<$Result.GetResult<Prisma.$CpuSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CpuSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CpuSessionCountArgs} args - Arguments to filter CpuSessions to count.
     * @example
     * // Count the number of CpuSessions
     * const count = await prisma.cpuSession.count({
     *   where: {
     *     // ... the filter for the CpuSessions we want to count
     *   }
     * })
    **/
    count<T extends CpuSessionCountArgs>(
      args?: Subset<T, CpuSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CpuSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CpuSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CpuSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CpuSessionAggregateArgs>(args: Subset<T, CpuSessionAggregateArgs>): Prisma.PrismaPromise<GetCpuSessionAggregateType<T>>

    /**
     * Group by CpuSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CpuSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CpuSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CpuSessionGroupByArgs['orderBy'] }
        : { orderBy?: CpuSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CpuSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCpuSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CpuSession model
   */
  readonly fields: CpuSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CpuSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CpuSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CpuSession model
   */
  interface CpuSessionFieldRefs {
    readonly id: FieldRef<"CpuSession", 'Int'>
    readonly algorithm: FieldRef<"CpuSession", 'String'>
    readonly mode: FieldRef<"CpuSession", 'String'>
    readonly avgWaitingTime: FieldRef<"CpuSession", 'Float'>
    readonly avgTurnaround: FieldRef<"CpuSession", 'Float'>
    readonly score: FieldRef<"CpuSession", 'Int'>
    readonly hearts: FieldRef<"CpuSession", 'Int'>
    readonly inputProcesses: FieldRef<"CpuSession", 'String'>
    readonly quantum: FieldRef<"CpuSession", 'Int'>
    readonly createdAt: FieldRef<"CpuSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CpuSession findUnique
   */
  export type CpuSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CpuSession
     */
    select?: CpuSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CpuSession
     */
    omit?: CpuSessionOmit<ExtArgs> | null
    /**
     * Filter, which CpuSession to fetch.
     */
    where: CpuSessionWhereUniqueInput
  }

  /**
   * CpuSession findUniqueOrThrow
   */
  export type CpuSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CpuSession
     */
    select?: CpuSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CpuSession
     */
    omit?: CpuSessionOmit<ExtArgs> | null
    /**
     * Filter, which CpuSession to fetch.
     */
    where: CpuSessionWhereUniqueInput
  }

  /**
   * CpuSession findFirst
   */
  export type CpuSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CpuSession
     */
    select?: CpuSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CpuSession
     */
    omit?: CpuSessionOmit<ExtArgs> | null
    /**
     * Filter, which CpuSession to fetch.
     */
    where?: CpuSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CpuSessions to fetch.
     */
    orderBy?: CpuSessionOrderByWithRelationInput | CpuSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CpuSessions.
     */
    cursor?: CpuSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CpuSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CpuSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CpuSessions.
     */
    distinct?: CpuSessionScalarFieldEnum | CpuSessionScalarFieldEnum[]
  }

  /**
   * CpuSession findFirstOrThrow
   */
  export type CpuSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CpuSession
     */
    select?: CpuSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CpuSession
     */
    omit?: CpuSessionOmit<ExtArgs> | null
    /**
     * Filter, which CpuSession to fetch.
     */
    where?: CpuSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CpuSessions to fetch.
     */
    orderBy?: CpuSessionOrderByWithRelationInput | CpuSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CpuSessions.
     */
    cursor?: CpuSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CpuSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CpuSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CpuSessions.
     */
    distinct?: CpuSessionScalarFieldEnum | CpuSessionScalarFieldEnum[]
  }

  /**
   * CpuSession findMany
   */
  export type CpuSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CpuSession
     */
    select?: CpuSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CpuSession
     */
    omit?: CpuSessionOmit<ExtArgs> | null
    /**
     * Filter, which CpuSessions to fetch.
     */
    where?: CpuSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CpuSessions to fetch.
     */
    orderBy?: CpuSessionOrderByWithRelationInput | CpuSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CpuSessions.
     */
    cursor?: CpuSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CpuSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CpuSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CpuSessions.
     */
    distinct?: CpuSessionScalarFieldEnum | CpuSessionScalarFieldEnum[]
  }

  /**
   * CpuSession create
   */
  export type CpuSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CpuSession
     */
    select?: CpuSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CpuSession
     */
    omit?: CpuSessionOmit<ExtArgs> | null
    /**
     * The data needed to create a CpuSession.
     */
    data: XOR<CpuSessionCreateInput, CpuSessionUncheckedCreateInput>
  }

  /**
   * CpuSession createMany
   */
  export type CpuSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CpuSessions.
     */
    data: CpuSessionCreateManyInput | CpuSessionCreateManyInput[]
  }

  /**
   * CpuSession createManyAndReturn
   */
  export type CpuSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CpuSession
     */
    select?: CpuSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CpuSession
     */
    omit?: CpuSessionOmit<ExtArgs> | null
    /**
     * The data used to create many CpuSessions.
     */
    data: CpuSessionCreateManyInput | CpuSessionCreateManyInput[]
  }

  /**
   * CpuSession update
   */
  export type CpuSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CpuSession
     */
    select?: CpuSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CpuSession
     */
    omit?: CpuSessionOmit<ExtArgs> | null
    /**
     * The data needed to update a CpuSession.
     */
    data: XOR<CpuSessionUpdateInput, CpuSessionUncheckedUpdateInput>
    /**
     * Choose, which CpuSession to update.
     */
    where: CpuSessionWhereUniqueInput
  }

  /**
   * CpuSession updateMany
   */
  export type CpuSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CpuSessions.
     */
    data: XOR<CpuSessionUpdateManyMutationInput, CpuSessionUncheckedUpdateManyInput>
    /**
     * Filter which CpuSessions to update
     */
    where?: CpuSessionWhereInput
    /**
     * Limit how many CpuSessions to update.
     */
    limit?: number
  }

  /**
   * CpuSession updateManyAndReturn
   */
  export type CpuSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CpuSession
     */
    select?: CpuSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CpuSession
     */
    omit?: CpuSessionOmit<ExtArgs> | null
    /**
     * The data used to update CpuSessions.
     */
    data: XOR<CpuSessionUpdateManyMutationInput, CpuSessionUncheckedUpdateManyInput>
    /**
     * Filter which CpuSessions to update
     */
    where?: CpuSessionWhereInput
    /**
     * Limit how many CpuSessions to update.
     */
    limit?: number
  }

  /**
   * CpuSession upsert
   */
  export type CpuSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CpuSession
     */
    select?: CpuSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CpuSession
     */
    omit?: CpuSessionOmit<ExtArgs> | null
    /**
     * The filter to search for the CpuSession to update in case it exists.
     */
    where: CpuSessionWhereUniqueInput
    /**
     * In case the CpuSession found by the `where` argument doesn't exist, create a new CpuSession with this data.
     */
    create: XOR<CpuSessionCreateInput, CpuSessionUncheckedCreateInput>
    /**
     * In case the CpuSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CpuSessionUpdateInput, CpuSessionUncheckedUpdateInput>
  }

  /**
   * CpuSession delete
   */
  export type CpuSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CpuSession
     */
    select?: CpuSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CpuSession
     */
    omit?: CpuSessionOmit<ExtArgs> | null
    /**
     * Filter which CpuSession to delete.
     */
    where: CpuSessionWhereUniqueInput
  }

  /**
   * CpuSession deleteMany
   */
  export type CpuSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CpuSessions to delete
     */
    where?: CpuSessionWhereInput
    /**
     * Limit how many CpuSessions to delete.
     */
    limit?: number
  }

  /**
   * CpuSession without action
   */
  export type CpuSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CpuSession
     */
    select?: CpuSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CpuSession
     */
    omit?: CpuSessionOmit<ExtArgs> | null
  }


  /**
   * Model VmSession
   */

  export type AggregateVmSession = {
    _count: VmSessionCountAggregateOutputType | null
    _avg: VmSessionAvgAggregateOutputType | null
    _sum: VmSessionSumAggregateOutputType | null
    _min: VmSessionMinAggregateOutputType | null
    _max: VmSessionMaxAggregateOutputType | null
  }

  export type VmSessionAvgAggregateOutputType = {
    id: number | null
    totalRefs: number | null
    pageFaults: number | null
    hits: number | null
    hitRatio: number | null
    score: number | null
    hearts: number | null
    frameCount: number | null
  }

  export type VmSessionSumAggregateOutputType = {
    id: number | null
    totalRefs: number | null
    pageFaults: number | null
    hits: number | null
    hitRatio: number | null
    score: number | null
    hearts: number | null
    frameCount: number | null
  }

  export type VmSessionMinAggregateOutputType = {
    id: number | null
    algorithm: string | null
    mode: string | null
    totalRefs: number | null
    pageFaults: number | null
    hits: number | null
    hitRatio: number | null
    score: number | null
    hearts: number | null
    inputRefString: string | null
    frameCount: number | null
    createdAt: Date | null
  }

  export type VmSessionMaxAggregateOutputType = {
    id: number | null
    algorithm: string | null
    mode: string | null
    totalRefs: number | null
    pageFaults: number | null
    hits: number | null
    hitRatio: number | null
    score: number | null
    hearts: number | null
    inputRefString: string | null
    frameCount: number | null
    createdAt: Date | null
  }

  export type VmSessionCountAggregateOutputType = {
    id: number
    algorithm: number
    mode: number
    totalRefs: number
    pageFaults: number
    hits: number
    hitRatio: number
    score: number
    hearts: number
    inputRefString: number
    frameCount: number
    createdAt: number
    _all: number
  }


  export type VmSessionAvgAggregateInputType = {
    id?: true
    totalRefs?: true
    pageFaults?: true
    hits?: true
    hitRatio?: true
    score?: true
    hearts?: true
    frameCount?: true
  }

  export type VmSessionSumAggregateInputType = {
    id?: true
    totalRefs?: true
    pageFaults?: true
    hits?: true
    hitRatio?: true
    score?: true
    hearts?: true
    frameCount?: true
  }

  export type VmSessionMinAggregateInputType = {
    id?: true
    algorithm?: true
    mode?: true
    totalRefs?: true
    pageFaults?: true
    hits?: true
    hitRatio?: true
    score?: true
    hearts?: true
    inputRefString?: true
    frameCount?: true
    createdAt?: true
  }

  export type VmSessionMaxAggregateInputType = {
    id?: true
    algorithm?: true
    mode?: true
    totalRefs?: true
    pageFaults?: true
    hits?: true
    hitRatio?: true
    score?: true
    hearts?: true
    inputRefString?: true
    frameCount?: true
    createdAt?: true
  }

  export type VmSessionCountAggregateInputType = {
    id?: true
    algorithm?: true
    mode?: true
    totalRefs?: true
    pageFaults?: true
    hits?: true
    hitRatio?: true
    score?: true
    hearts?: true
    inputRefString?: true
    frameCount?: true
    createdAt?: true
    _all?: true
  }

  export type VmSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VmSession to aggregate.
     */
    where?: VmSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VmSessions to fetch.
     */
    orderBy?: VmSessionOrderByWithRelationInput | VmSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VmSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VmSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VmSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VmSessions
    **/
    _count?: true | VmSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VmSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VmSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VmSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VmSessionMaxAggregateInputType
  }

  export type GetVmSessionAggregateType<T extends VmSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateVmSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVmSession[P]>
      : GetScalarType<T[P], AggregateVmSession[P]>
  }




  export type VmSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VmSessionWhereInput
    orderBy?: VmSessionOrderByWithAggregationInput | VmSessionOrderByWithAggregationInput[]
    by: VmSessionScalarFieldEnum[] | VmSessionScalarFieldEnum
    having?: VmSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VmSessionCountAggregateInputType | true
    _avg?: VmSessionAvgAggregateInputType
    _sum?: VmSessionSumAggregateInputType
    _min?: VmSessionMinAggregateInputType
    _max?: VmSessionMaxAggregateInputType
  }

  export type VmSessionGroupByOutputType = {
    id: number
    algorithm: string
    mode: string
    totalRefs: number
    pageFaults: number
    hits: number
    hitRatio: number
    score: number
    hearts: number
    inputRefString: string | null
    frameCount: number
    createdAt: Date
    _count: VmSessionCountAggregateOutputType | null
    _avg: VmSessionAvgAggregateOutputType | null
    _sum: VmSessionSumAggregateOutputType | null
    _min: VmSessionMinAggregateOutputType | null
    _max: VmSessionMaxAggregateOutputType | null
  }

  type GetVmSessionGroupByPayload<T extends VmSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VmSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VmSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VmSessionGroupByOutputType[P]>
            : GetScalarType<T[P], VmSessionGroupByOutputType[P]>
        }
      >
    >


  export type VmSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    algorithm?: boolean
    mode?: boolean
    totalRefs?: boolean
    pageFaults?: boolean
    hits?: boolean
    hitRatio?: boolean
    score?: boolean
    hearts?: boolean
    inputRefString?: boolean
    frameCount?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["vmSession"]>

  export type VmSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    algorithm?: boolean
    mode?: boolean
    totalRefs?: boolean
    pageFaults?: boolean
    hits?: boolean
    hitRatio?: boolean
    score?: boolean
    hearts?: boolean
    inputRefString?: boolean
    frameCount?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["vmSession"]>

  export type VmSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    algorithm?: boolean
    mode?: boolean
    totalRefs?: boolean
    pageFaults?: boolean
    hits?: boolean
    hitRatio?: boolean
    score?: boolean
    hearts?: boolean
    inputRefString?: boolean
    frameCount?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["vmSession"]>

  export type VmSessionSelectScalar = {
    id?: boolean
    algorithm?: boolean
    mode?: boolean
    totalRefs?: boolean
    pageFaults?: boolean
    hits?: boolean
    hitRatio?: boolean
    score?: boolean
    hearts?: boolean
    inputRefString?: boolean
    frameCount?: boolean
    createdAt?: boolean
  }

  export type VmSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "algorithm" | "mode" | "totalRefs" | "pageFaults" | "hits" | "hitRatio" | "score" | "hearts" | "inputRefString" | "frameCount" | "createdAt", ExtArgs["result"]["vmSession"]>

  export type $VmSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VmSession"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      algorithm: string
      mode: string
      totalRefs: number
      pageFaults: number
      hits: number
      hitRatio: number
      score: number
      hearts: number
      inputRefString: string | null
      frameCount: number
      createdAt: Date
    }, ExtArgs["result"]["vmSession"]>
    composites: {}
  }

  type VmSessionGetPayload<S extends boolean | null | undefined | VmSessionDefaultArgs> = $Result.GetResult<Prisma.$VmSessionPayload, S>

  type VmSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VmSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VmSessionCountAggregateInputType | true
    }

  export interface VmSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VmSession'], meta: { name: 'VmSession' } }
    /**
     * Find zero or one VmSession that matches the filter.
     * @param {VmSessionFindUniqueArgs} args - Arguments to find a VmSession
     * @example
     * // Get one VmSession
     * const vmSession = await prisma.vmSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VmSessionFindUniqueArgs>(args: SelectSubset<T, VmSessionFindUniqueArgs<ExtArgs>>): Prisma__VmSessionClient<$Result.GetResult<Prisma.$VmSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VmSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VmSessionFindUniqueOrThrowArgs} args - Arguments to find a VmSession
     * @example
     * // Get one VmSession
     * const vmSession = await prisma.vmSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VmSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, VmSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VmSessionClient<$Result.GetResult<Prisma.$VmSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VmSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VmSessionFindFirstArgs} args - Arguments to find a VmSession
     * @example
     * // Get one VmSession
     * const vmSession = await prisma.vmSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VmSessionFindFirstArgs>(args?: SelectSubset<T, VmSessionFindFirstArgs<ExtArgs>>): Prisma__VmSessionClient<$Result.GetResult<Prisma.$VmSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VmSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VmSessionFindFirstOrThrowArgs} args - Arguments to find a VmSession
     * @example
     * // Get one VmSession
     * const vmSession = await prisma.vmSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VmSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, VmSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__VmSessionClient<$Result.GetResult<Prisma.$VmSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VmSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VmSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VmSessions
     * const vmSessions = await prisma.vmSession.findMany()
     * 
     * // Get first 10 VmSessions
     * const vmSessions = await prisma.vmSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vmSessionWithIdOnly = await prisma.vmSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VmSessionFindManyArgs>(args?: SelectSubset<T, VmSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VmSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VmSession.
     * @param {VmSessionCreateArgs} args - Arguments to create a VmSession.
     * @example
     * // Create one VmSession
     * const VmSession = await prisma.vmSession.create({
     *   data: {
     *     // ... data to create a VmSession
     *   }
     * })
     * 
     */
    create<T extends VmSessionCreateArgs>(args: SelectSubset<T, VmSessionCreateArgs<ExtArgs>>): Prisma__VmSessionClient<$Result.GetResult<Prisma.$VmSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VmSessions.
     * @param {VmSessionCreateManyArgs} args - Arguments to create many VmSessions.
     * @example
     * // Create many VmSessions
     * const vmSession = await prisma.vmSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VmSessionCreateManyArgs>(args?: SelectSubset<T, VmSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VmSessions and returns the data saved in the database.
     * @param {VmSessionCreateManyAndReturnArgs} args - Arguments to create many VmSessions.
     * @example
     * // Create many VmSessions
     * const vmSession = await prisma.vmSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VmSessions and only return the `id`
     * const vmSessionWithIdOnly = await prisma.vmSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VmSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, VmSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VmSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VmSession.
     * @param {VmSessionDeleteArgs} args - Arguments to delete one VmSession.
     * @example
     * // Delete one VmSession
     * const VmSession = await prisma.vmSession.delete({
     *   where: {
     *     // ... filter to delete one VmSession
     *   }
     * })
     * 
     */
    delete<T extends VmSessionDeleteArgs>(args: SelectSubset<T, VmSessionDeleteArgs<ExtArgs>>): Prisma__VmSessionClient<$Result.GetResult<Prisma.$VmSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VmSession.
     * @param {VmSessionUpdateArgs} args - Arguments to update one VmSession.
     * @example
     * // Update one VmSession
     * const vmSession = await prisma.vmSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VmSessionUpdateArgs>(args: SelectSubset<T, VmSessionUpdateArgs<ExtArgs>>): Prisma__VmSessionClient<$Result.GetResult<Prisma.$VmSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VmSessions.
     * @param {VmSessionDeleteManyArgs} args - Arguments to filter VmSessions to delete.
     * @example
     * // Delete a few VmSessions
     * const { count } = await prisma.vmSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VmSessionDeleteManyArgs>(args?: SelectSubset<T, VmSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VmSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VmSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VmSessions
     * const vmSession = await prisma.vmSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VmSessionUpdateManyArgs>(args: SelectSubset<T, VmSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VmSessions and returns the data updated in the database.
     * @param {VmSessionUpdateManyAndReturnArgs} args - Arguments to update many VmSessions.
     * @example
     * // Update many VmSessions
     * const vmSession = await prisma.vmSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VmSessions and only return the `id`
     * const vmSessionWithIdOnly = await prisma.vmSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VmSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, VmSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VmSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VmSession.
     * @param {VmSessionUpsertArgs} args - Arguments to update or create a VmSession.
     * @example
     * // Update or create a VmSession
     * const vmSession = await prisma.vmSession.upsert({
     *   create: {
     *     // ... data to create a VmSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VmSession we want to update
     *   }
     * })
     */
    upsert<T extends VmSessionUpsertArgs>(args: SelectSubset<T, VmSessionUpsertArgs<ExtArgs>>): Prisma__VmSessionClient<$Result.GetResult<Prisma.$VmSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VmSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VmSessionCountArgs} args - Arguments to filter VmSessions to count.
     * @example
     * // Count the number of VmSessions
     * const count = await prisma.vmSession.count({
     *   where: {
     *     // ... the filter for the VmSessions we want to count
     *   }
     * })
    **/
    count<T extends VmSessionCountArgs>(
      args?: Subset<T, VmSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VmSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VmSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VmSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VmSessionAggregateArgs>(args: Subset<T, VmSessionAggregateArgs>): Prisma.PrismaPromise<GetVmSessionAggregateType<T>>

    /**
     * Group by VmSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VmSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VmSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VmSessionGroupByArgs['orderBy'] }
        : { orderBy?: VmSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VmSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVmSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VmSession model
   */
  readonly fields: VmSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VmSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VmSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VmSession model
   */
  interface VmSessionFieldRefs {
    readonly id: FieldRef<"VmSession", 'Int'>
    readonly algorithm: FieldRef<"VmSession", 'String'>
    readonly mode: FieldRef<"VmSession", 'String'>
    readonly totalRefs: FieldRef<"VmSession", 'Int'>
    readonly pageFaults: FieldRef<"VmSession", 'Int'>
    readonly hits: FieldRef<"VmSession", 'Int'>
    readonly hitRatio: FieldRef<"VmSession", 'Float'>
    readonly score: FieldRef<"VmSession", 'Int'>
    readonly hearts: FieldRef<"VmSession", 'Int'>
    readonly inputRefString: FieldRef<"VmSession", 'String'>
    readonly frameCount: FieldRef<"VmSession", 'Int'>
    readonly createdAt: FieldRef<"VmSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VmSession findUnique
   */
  export type VmSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VmSession
     */
    select?: VmSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VmSession
     */
    omit?: VmSessionOmit<ExtArgs> | null
    /**
     * Filter, which VmSession to fetch.
     */
    where: VmSessionWhereUniqueInput
  }

  /**
   * VmSession findUniqueOrThrow
   */
  export type VmSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VmSession
     */
    select?: VmSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VmSession
     */
    omit?: VmSessionOmit<ExtArgs> | null
    /**
     * Filter, which VmSession to fetch.
     */
    where: VmSessionWhereUniqueInput
  }

  /**
   * VmSession findFirst
   */
  export type VmSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VmSession
     */
    select?: VmSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VmSession
     */
    omit?: VmSessionOmit<ExtArgs> | null
    /**
     * Filter, which VmSession to fetch.
     */
    where?: VmSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VmSessions to fetch.
     */
    orderBy?: VmSessionOrderByWithRelationInput | VmSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VmSessions.
     */
    cursor?: VmSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VmSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VmSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VmSessions.
     */
    distinct?: VmSessionScalarFieldEnum | VmSessionScalarFieldEnum[]
  }

  /**
   * VmSession findFirstOrThrow
   */
  export type VmSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VmSession
     */
    select?: VmSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VmSession
     */
    omit?: VmSessionOmit<ExtArgs> | null
    /**
     * Filter, which VmSession to fetch.
     */
    where?: VmSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VmSessions to fetch.
     */
    orderBy?: VmSessionOrderByWithRelationInput | VmSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VmSessions.
     */
    cursor?: VmSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VmSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VmSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VmSessions.
     */
    distinct?: VmSessionScalarFieldEnum | VmSessionScalarFieldEnum[]
  }

  /**
   * VmSession findMany
   */
  export type VmSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VmSession
     */
    select?: VmSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VmSession
     */
    omit?: VmSessionOmit<ExtArgs> | null
    /**
     * Filter, which VmSessions to fetch.
     */
    where?: VmSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VmSessions to fetch.
     */
    orderBy?: VmSessionOrderByWithRelationInput | VmSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VmSessions.
     */
    cursor?: VmSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VmSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VmSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VmSessions.
     */
    distinct?: VmSessionScalarFieldEnum | VmSessionScalarFieldEnum[]
  }

  /**
   * VmSession create
   */
  export type VmSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VmSession
     */
    select?: VmSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VmSession
     */
    omit?: VmSessionOmit<ExtArgs> | null
    /**
     * The data needed to create a VmSession.
     */
    data: XOR<VmSessionCreateInput, VmSessionUncheckedCreateInput>
  }

  /**
   * VmSession createMany
   */
  export type VmSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VmSessions.
     */
    data: VmSessionCreateManyInput | VmSessionCreateManyInput[]
  }

  /**
   * VmSession createManyAndReturn
   */
  export type VmSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VmSession
     */
    select?: VmSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VmSession
     */
    omit?: VmSessionOmit<ExtArgs> | null
    /**
     * The data used to create many VmSessions.
     */
    data: VmSessionCreateManyInput | VmSessionCreateManyInput[]
  }

  /**
   * VmSession update
   */
  export type VmSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VmSession
     */
    select?: VmSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VmSession
     */
    omit?: VmSessionOmit<ExtArgs> | null
    /**
     * The data needed to update a VmSession.
     */
    data: XOR<VmSessionUpdateInput, VmSessionUncheckedUpdateInput>
    /**
     * Choose, which VmSession to update.
     */
    where: VmSessionWhereUniqueInput
  }

  /**
   * VmSession updateMany
   */
  export type VmSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VmSessions.
     */
    data: XOR<VmSessionUpdateManyMutationInput, VmSessionUncheckedUpdateManyInput>
    /**
     * Filter which VmSessions to update
     */
    where?: VmSessionWhereInput
    /**
     * Limit how many VmSessions to update.
     */
    limit?: number
  }

  /**
   * VmSession updateManyAndReturn
   */
  export type VmSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VmSession
     */
    select?: VmSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VmSession
     */
    omit?: VmSessionOmit<ExtArgs> | null
    /**
     * The data used to update VmSessions.
     */
    data: XOR<VmSessionUpdateManyMutationInput, VmSessionUncheckedUpdateManyInput>
    /**
     * Filter which VmSessions to update
     */
    where?: VmSessionWhereInput
    /**
     * Limit how many VmSessions to update.
     */
    limit?: number
  }

  /**
   * VmSession upsert
   */
  export type VmSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VmSession
     */
    select?: VmSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VmSession
     */
    omit?: VmSessionOmit<ExtArgs> | null
    /**
     * The filter to search for the VmSession to update in case it exists.
     */
    where: VmSessionWhereUniqueInput
    /**
     * In case the VmSession found by the `where` argument doesn't exist, create a new VmSession with this data.
     */
    create: XOR<VmSessionCreateInput, VmSessionUncheckedCreateInput>
    /**
     * In case the VmSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VmSessionUpdateInput, VmSessionUncheckedUpdateInput>
  }

  /**
   * VmSession delete
   */
  export type VmSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VmSession
     */
    select?: VmSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VmSession
     */
    omit?: VmSessionOmit<ExtArgs> | null
    /**
     * Filter which VmSession to delete.
     */
    where: VmSessionWhereUniqueInput
  }

  /**
   * VmSession deleteMany
   */
  export type VmSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VmSessions to delete
     */
    where?: VmSessionWhereInput
    /**
     * Limit how many VmSessions to delete.
     */
    limit?: number
  }

  /**
   * VmSession without action
   */
  export type VmSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VmSession
     */
    select?: VmSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VmSession
     */
    omit?: VmSessionOmit<ExtArgs> | null
  }


  /**
   * Model DiskSession
   */

  export type AggregateDiskSession = {
    _count: DiskSessionCountAggregateOutputType | null
    _avg: DiskSessionAvgAggregateOutputType | null
    _sum: DiskSessionSumAggregateOutputType | null
    _min: DiskSessionMinAggregateOutputType | null
    _max: DiskSessionMaxAggregateOutputType | null
  }

  export type DiskSessionAvgAggregateOutputType = {
    id: number | null
    headStart: number | null
    totalMovement: number | null
    score: number | null
    hearts: number | null
  }

  export type DiskSessionSumAggregateOutputType = {
    id: number | null
    headStart: number | null
    totalMovement: number | null
    score: number | null
    hearts: number | null
  }

  export type DiskSessionMinAggregateOutputType = {
    id: number | null
    algorithm: string | null
    mode: string | null
    headStart: number | null
    totalMovement: number | null
    score: number | null
    hearts: number | null
    inputRequests: string | null
    createdAt: Date | null
  }

  export type DiskSessionMaxAggregateOutputType = {
    id: number | null
    algorithm: string | null
    mode: string | null
    headStart: number | null
    totalMovement: number | null
    score: number | null
    hearts: number | null
    inputRequests: string | null
    createdAt: Date | null
  }

  export type DiskSessionCountAggregateOutputType = {
    id: number
    algorithm: number
    mode: number
    headStart: number
    totalMovement: number
    score: number
    hearts: number
    inputRequests: number
    createdAt: number
    _all: number
  }


  export type DiskSessionAvgAggregateInputType = {
    id?: true
    headStart?: true
    totalMovement?: true
    score?: true
    hearts?: true
  }

  export type DiskSessionSumAggregateInputType = {
    id?: true
    headStart?: true
    totalMovement?: true
    score?: true
    hearts?: true
  }

  export type DiskSessionMinAggregateInputType = {
    id?: true
    algorithm?: true
    mode?: true
    headStart?: true
    totalMovement?: true
    score?: true
    hearts?: true
    inputRequests?: true
    createdAt?: true
  }

  export type DiskSessionMaxAggregateInputType = {
    id?: true
    algorithm?: true
    mode?: true
    headStart?: true
    totalMovement?: true
    score?: true
    hearts?: true
    inputRequests?: true
    createdAt?: true
  }

  export type DiskSessionCountAggregateInputType = {
    id?: true
    algorithm?: true
    mode?: true
    headStart?: true
    totalMovement?: true
    score?: true
    hearts?: true
    inputRequests?: true
    createdAt?: true
    _all?: true
  }

  export type DiskSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DiskSession to aggregate.
     */
    where?: DiskSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiskSessions to fetch.
     */
    orderBy?: DiskSessionOrderByWithRelationInput | DiskSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DiskSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiskSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiskSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DiskSessions
    **/
    _count?: true | DiskSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DiskSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DiskSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DiskSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DiskSessionMaxAggregateInputType
  }

  export type GetDiskSessionAggregateType<T extends DiskSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateDiskSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDiskSession[P]>
      : GetScalarType<T[P], AggregateDiskSession[P]>
  }




  export type DiskSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DiskSessionWhereInput
    orderBy?: DiskSessionOrderByWithAggregationInput | DiskSessionOrderByWithAggregationInput[]
    by: DiskSessionScalarFieldEnum[] | DiskSessionScalarFieldEnum
    having?: DiskSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DiskSessionCountAggregateInputType | true
    _avg?: DiskSessionAvgAggregateInputType
    _sum?: DiskSessionSumAggregateInputType
    _min?: DiskSessionMinAggregateInputType
    _max?: DiskSessionMaxAggregateInputType
  }

  export type DiskSessionGroupByOutputType = {
    id: number
    algorithm: string
    mode: string
    headStart: number
    totalMovement: number
    score: number
    hearts: number
    inputRequests: string | null
    createdAt: Date
    _count: DiskSessionCountAggregateOutputType | null
    _avg: DiskSessionAvgAggregateOutputType | null
    _sum: DiskSessionSumAggregateOutputType | null
    _min: DiskSessionMinAggregateOutputType | null
    _max: DiskSessionMaxAggregateOutputType | null
  }

  type GetDiskSessionGroupByPayload<T extends DiskSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DiskSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DiskSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DiskSessionGroupByOutputType[P]>
            : GetScalarType<T[P], DiskSessionGroupByOutputType[P]>
        }
      >
    >


  export type DiskSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    algorithm?: boolean
    mode?: boolean
    headStart?: boolean
    totalMovement?: boolean
    score?: boolean
    hearts?: boolean
    inputRequests?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["diskSession"]>

  export type DiskSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    algorithm?: boolean
    mode?: boolean
    headStart?: boolean
    totalMovement?: boolean
    score?: boolean
    hearts?: boolean
    inputRequests?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["diskSession"]>

  export type DiskSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    algorithm?: boolean
    mode?: boolean
    headStart?: boolean
    totalMovement?: boolean
    score?: boolean
    hearts?: boolean
    inputRequests?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["diskSession"]>

  export type DiskSessionSelectScalar = {
    id?: boolean
    algorithm?: boolean
    mode?: boolean
    headStart?: boolean
    totalMovement?: boolean
    score?: boolean
    hearts?: boolean
    inputRequests?: boolean
    createdAt?: boolean
  }

  export type DiskSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "algorithm" | "mode" | "headStart" | "totalMovement" | "score" | "hearts" | "inputRequests" | "createdAt", ExtArgs["result"]["diskSession"]>

  export type $DiskSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DiskSession"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      algorithm: string
      mode: string
      headStart: number
      totalMovement: number
      score: number
      hearts: number
      inputRequests: string | null
      createdAt: Date
    }, ExtArgs["result"]["diskSession"]>
    composites: {}
  }

  type DiskSessionGetPayload<S extends boolean | null | undefined | DiskSessionDefaultArgs> = $Result.GetResult<Prisma.$DiskSessionPayload, S>

  type DiskSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DiskSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DiskSessionCountAggregateInputType | true
    }

  export interface DiskSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DiskSession'], meta: { name: 'DiskSession' } }
    /**
     * Find zero or one DiskSession that matches the filter.
     * @param {DiskSessionFindUniqueArgs} args - Arguments to find a DiskSession
     * @example
     * // Get one DiskSession
     * const diskSession = await prisma.diskSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DiskSessionFindUniqueArgs>(args: SelectSubset<T, DiskSessionFindUniqueArgs<ExtArgs>>): Prisma__DiskSessionClient<$Result.GetResult<Prisma.$DiskSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DiskSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DiskSessionFindUniqueOrThrowArgs} args - Arguments to find a DiskSession
     * @example
     * // Get one DiskSession
     * const diskSession = await prisma.diskSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DiskSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, DiskSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DiskSessionClient<$Result.GetResult<Prisma.$DiskSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DiskSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiskSessionFindFirstArgs} args - Arguments to find a DiskSession
     * @example
     * // Get one DiskSession
     * const diskSession = await prisma.diskSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DiskSessionFindFirstArgs>(args?: SelectSubset<T, DiskSessionFindFirstArgs<ExtArgs>>): Prisma__DiskSessionClient<$Result.GetResult<Prisma.$DiskSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DiskSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiskSessionFindFirstOrThrowArgs} args - Arguments to find a DiskSession
     * @example
     * // Get one DiskSession
     * const diskSession = await prisma.diskSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DiskSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, DiskSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__DiskSessionClient<$Result.GetResult<Prisma.$DiskSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DiskSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiskSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DiskSessions
     * const diskSessions = await prisma.diskSession.findMany()
     * 
     * // Get first 10 DiskSessions
     * const diskSessions = await prisma.diskSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const diskSessionWithIdOnly = await prisma.diskSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DiskSessionFindManyArgs>(args?: SelectSubset<T, DiskSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiskSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DiskSession.
     * @param {DiskSessionCreateArgs} args - Arguments to create a DiskSession.
     * @example
     * // Create one DiskSession
     * const DiskSession = await prisma.diskSession.create({
     *   data: {
     *     // ... data to create a DiskSession
     *   }
     * })
     * 
     */
    create<T extends DiskSessionCreateArgs>(args: SelectSubset<T, DiskSessionCreateArgs<ExtArgs>>): Prisma__DiskSessionClient<$Result.GetResult<Prisma.$DiskSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DiskSessions.
     * @param {DiskSessionCreateManyArgs} args - Arguments to create many DiskSessions.
     * @example
     * // Create many DiskSessions
     * const diskSession = await prisma.diskSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DiskSessionCreateManyArgs>(args?: SelectSubset<T, DiskSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DiskSessions and returns the data saved in the database.
     * @param {DiskSessionCreateManyAndReturnArgs} args - Arguments to create many DiskSessions.
     * @example
     * // Create many DiskSessions
     * const diskSession = await prisma.diskSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DiskSessions and only return the `id`
     * const diskSessionWithIdOnly = await prisma.diskSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DiskSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, DiskSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiskSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DiskSession.
     * @param {DiskSessionDeleteArgs} args - Arguments to delete one DiskSession.
     * @example
     * // Delete one DiskSession
     * const DiskSession = await prisma.diskSession.delete({
     *   where: {
     *     // ... filter to delete one DiskSession
     *   }
     * })
     * 
     */
    delete<T extends DiskSessionDeleteArgs>(args: SelectSubset<T, DiskSessionDeleteArgs<ExtArgs>>): Prisma__DiskSessionClient<$Result.GetResult<Prisma.$DiskSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DiskSession.
     * @param {DiskSessionUpdateArgs} args - Arguments to update one DiskSession.
     * @example
     * // Update one DiskSession
     * const diskSession = await prisma.diskSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DiskSessionUpdateArgs>(args: SelectSubset<T, DiskSessionUpdateArgs<ExtArgs>>): Prisma__DiskSessionClient<$Result.GetResult<Prisma.$DiskSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DiskSessions.
     * @param {DiskSessionDeleteManyArgs} args - Arguments to filter DiskSessions to delete.
     * @example
     * // Delete a few DiskSessions
     * const { count } = await prisma.diskSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DiskSessionDeleteManyArgs>(args?: SelectSubset<T, DiskSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DiskSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiskSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DiskSessions
     * const diskSession = await prisma.diskSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DiskSessionUpdateManyArgs>(args: SelectSubset<T, DiskSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DiskSessions and returns the data updated in the database.
     * @param {DiskSessionUpdateManyAndReturnArgs} args - Arguments to update many DiskSessions.
     * @example
     * // Update many DiskSessions
     * const diskSession = await prisma.diskSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DiskSessions and only return the `id`
     * const diskSessionWithIdOnly = await prisma.diskSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DiskSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, DiskSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiskSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DiskSession.
     * @param {DiskSessionUpsertArgs} args - Arguments to update or create a DiskSession.
     * @example
     * // Update or create a DiskSession
     * const diskSession = await prisma.diskSession.upsert({
     *   create: {
     *     // ... data to create a DiskSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DiskSession we want to update
     *   }
     * })
     */
    upsert<T extends DiskSessionUpsertArgs>(args: SelectSubset<T, DiskSessionUpsertArgs<ExtArgs>>): Prisma__DiskSessionClient<$Result.GetResult<Prisma.$DiskSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DiskSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiskSessionCountArgs} args - Arguments to filter DiskSessions to count.
     * @example
     * // Count the number of DiskSessions
     * const count = await prisma.diskSession.count({
     *   where: {
     *     // ... the filter for the DiskSessions we want to count
     *   }
     * })
    **/
    count<T extends DiskSessionCountArgs>(
      args?: Subset<T, DiskSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DiskSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DiskSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiskSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DiskSessionAggregateArgs>(args: Subset<T, DiskSessionAggregateArgs>): Prisma.PrismaPromise<GetDiskSessionAggregateType<T>>

    /**
     * Group by DiskSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiskSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DiskSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DiskSessionGroupByArgs['orderBy'] }
        : { orderBy?: DiskSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DiskSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDiskSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DiskSession model
   */
  readonly fields: DiskSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DiskSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DiskSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DiskSession model
   */
  interface DiskSessionFieldRefs {
    readonly id: FieldRef<"DiskSession", 'Int'>
    readonly algorithm: FieldRef<"DiskSession", 'String'>
    readonly mode: FieldRef<"DiskSession", 'String'>
    readonly headStart: FieldRef<"DiskSession", 'Int'>
    readonly totalMovement: FieldRef<"DiskSession", 'Int'>
    readonly score: FieldRef<"DiskSession", 'Int'>
    readonly hearts: FieldRef<"DiskSession", 'Int'>
    readonly inputRequests: FieldRef<"DiskSession", 'String'>
    readonly createdAt: FieldRef<"DiskSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DiskSession findUnique
   */
  export type DiskSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiskSession
     */
    select?: DiskSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiskSession
     */
    omit?: DiskSessionOmit<ExtArgs> | null
    /**
     * Filter, which DiskSession to fetch.
     */
    where: DiskSessionWhereUniqueInput
  }

  /**
   * DiskSession findUniqueOrThrow
   */
  export type DiskSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiskSession
     */
    select?: DiskSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiskSession
     */
    omit?: DiskSessionOmit<ExtArgs> | null
    /**
     * Filter, which DiskSession to fetch.
     */
    where: DiskSessionWhereUniqueInput
  }

  /**
   * DiskSession findFirst
   */
  export type DiskSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiskSession
     */
    select?: DiskSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiskSession
     */
    omit?: DiskSessionOmit<ExtArgs> | null
    /**
     * Filter, which DiskSession to fetch.
     */
    where?: DiskSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiskSessions to fetch.
     */
    orderBy?: DiskSessionOrderByWithRelationInput | DiskSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DiskSessions.
     */
    cursor?: DiskSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiskSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiskSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiskSessions.
     */
    distinct?: DiskSessionScalarFieldEnum | DiskSessionScalarFieldEnum[]
  }

  /**
   * DiskSession findFirstOrThrow
   */
  export type DiskSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiskSession
     */
    select?: DiskSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiskSession
     */
    omit?: DiskSessionOmit<ExtArgs> | null
    /**
     * Filter, which DiskSession to fetch.
     */
    where?: DiskSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiskSessions to fetch.
     */
    orderBy?: DiskSessionOrderByWithRelationInput | DiskSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DiskSessions.
     */
    cursor?: DiskSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiskSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiskSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiskSessions.
     */
    distinct?: DiskSessionScalarFieldEnum | DiskSessionScalarFieldEnum[]
  }

  /**
   * DiskSession findMany
   */
  export type DiskSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiskSession
     */
    select?: DiskSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiskSession
     */
    omit?: DiskSessionOmit<ExtArgs> | null
    /**
     * Filter, which DiskSessions to fetch.
     */
    where?: DiskSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiskSessions to fetch.
     */
    orderBy?: DiskSessionOrderByWithRelationInput | DiskSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DiskSessions.
     */
    cursor?: DiskSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiskSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiskSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiskSessions.
     */
    distinct?: DiskSessionScalarFieldEnum | DiskSessionScalarFieldEnum[]
  }

  /**
   * DiskSession create
   */
  export type DiskSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiskSession
     */
    select?: DiskSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiskSession
     */
    omit?: DiskSessionOmit<ExtArgs> | null
    /**
     * The data needed to create a DiskSession.
     */
    data: XOR<DiskSessionCreateInput, DiskSessionUncheckedCreateInput>
  }

  /**
   * DiskSession createMany
   */
  export type DiskSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DiskSessions.
     */
    data: DiskSessionCreateManyInput | DiskSessionCreateManyInput[]
  }

  /**
   * DiskSession createManyAndReturn
   */
  export type DiskSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiskSession
     */
    select?: DiskSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DiskSession
     */
    omit?: DiskSessionOmit<ExtArgs> | null
    /**
     * The data used to create many DiskSessions.
     */
    data: DiskSessionCreateManyInput | DiskSessionCreateManyInput[]
  }

  /**
   * DiskSession update
   */
  export type DiskSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiskSession
     */
    select?: DiskSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiskSession
     */
    omit?: DiskSessionOmit<ExtArgs> | null
    /**
     * The data needed to update a DiskSession.
     */
    data: XOR<DiskSessionUpdateInput, DiskSessionUncheckedUpdateInput>
    /**
     * Choose, which DiskSession to update.
     */
    where: DiskSessionWhereUniqueInput
  }

  /**
   * DiskSession updateMany
   */
  export type DiskSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DiskSessions.
     */
    data: XOR<DiskSessionUpdateManyMutationInput, DiskSessionUncheckedUpdateManyInput>
    /**
     * Filter which DiskSessions to update
     */
    where?: DiskSessionWhereInput
    /**
     * Limit how many DiskSessions to update.
     */
    limit?: number
  }

  /**
   * DiskSession updateManyAndReturn
   */
  export type DiskSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiskSession
     */
    select?: DiskSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DiskSession
     */
    omit?: DiskSessionOmit<ExtArgs> | null
    /**
     * The data used to update DiskSessions.
     */
    data: XOR<DiskSessionUpdateManyMutationInput, DiskSessionUncheckedUpdateManyInput>
    /**
     * Filter which DiskSessions to update
     */
    where?: DiskSessionWhereInput
    /**
     * Limit how many DiskSessions to update.
     */
    limit?: number
  }

  /**
   * DiskSession upsert
   */
  export type DiskSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiskSession
     */
    select?: DiskSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiskSession
     */
    omit?: DiskSessionOmit<ExtArgs> | null
    /**
     * The filter to search for the DiskSession to update in case it exists.
     */
    where: DiskSessionWhereUniqueInput
    /**
     * In case the DiskSession found by the `where` argument doesn't exist, create a new DiskSession with this data.
     */
    create: XOR<DiskSessionCreateInput, DiskSessionUncheckedCreateInput>
    /**
     * In case the DiskSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DiskSessionUpdateInput, DiskSessionUncheckedUpdateInput>
  }

  /**
   * DiskSession delete
   */
  export type DiskSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiskSession
     */
    select?: DiskSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiskSession
     */
    omit?: DiskSessionOmit<ExtArgs> | null
    /**
     * Filter which DiskSession to delete.
     */
    where: DiskSessionWhereUniqueInput
  }

  /**
   * DiskSession deleteMany
   */
  export type DiskSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DiskSessions to delete
     */
    where?: DiskSessionWhereInput
    /**
     * Limit how many DiskSessions to delete.
     */
    limit?: number
  }

  /**
   * DiskSession without action
   */
  export type DiskSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiskSession
     */
    select?: DiskSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiskSession
     */
    omit?: DiskSessionOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const MemorySessionScalarFieldEnum: {
    id: 'id',
    algorithm: 'algorithm',
    stageType: 'stageType',
    mode: 'mode',
    score: 'score',
    hearts: 'hearts',
    processed: 'processed',
    unprocessed: 'unprocessed',
    createdAt: 'createdAt'
  };

  export type MemorySessionScalarFieldEnum = (typeof MemorySessionScalarFieldEnum)[keyof typeof MemorySessionScalarFieldEnum]


  export const CpuSessionScalarFieldEnum: {
    id: 'id',
    algorithm: 'algorithm',
    mode: 'mode',
    avgWaitingTime: 'avgWaitingTime',
    avgTurnaround: 'avgTurnaround',
    score: 'score',
    hearts: 'hearts',
    inputProcesses: 'inputProcesses',
    quantum: 'quantum',
    createdAt: 'createdAt'
  };

  export type CpuSessionScalarFieldEnum = (typeof CpuSessionScalarFieldEnum)[keyof typeof CpuSessionScalarFieldEnum]


  export const VmSessionScalarFieldEnum: {
    id: 'id',
    algorithm: 'algorithm',
    mode: 'mode',
    totalRefs: 'totalRefs',
    pageFaults: 'pageFaults',
    hits: 'hits',
    hitRatio: 'hitRatio',
    score: 'score',
    hearts: 'hearts',
    inputRefString: 'inputRefString',
    frameCount: 'frameCount',
    createdAt: 'createdAt'
  };

  export type VmSessionScalarFieldEnum = (typeof VmSessionScalarFieldEnum)[keyof typeof VmSessionScalarFieldEnum]


  export const DiskSessionScalarFieldEnum: {
    id: 'id',
    algorithm: 'algorithm',
    mode: 'mode',
    headStart: 'headStart',
    totalMovement: 'totalMovement',
    score: 'score',
    hearts: 'hearts',
    inputRequests: 'inputRequests',
    createdAt: 'createdAt'
  };

  export type DiskSessionScalarFieldEnum = (typeof DiskSessionScalarFieldEnum)[keyof typeof DiskSessionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type MemorySessionWhereInput = {
    AND?: MemorySessionWhereInput | MemorySessionWhereInput[]
    OR?: MemorySessionWhereInput[]
    NOT?: MemorySessionWhereInput | MemorySessionWhereInput[]
    id?: IntFilter<"MemorySession"> | number
    algorithm?: StringFilter<"MemorySession"> | string
    stageType?: StringNullableFilter<"MemorySession"> | string | null
    mode?: StringFilter<"MemorySession"> | string
    score?: IntFilter<"MemorySession"> | number
    hearts?: IntFilter<"MemorySession"> | number
    processed?: IntFilter<"MemorySession"> | number
    unprocessed?: IntFilter<"MemorySession"> | number
    createdAt?: DateTimeFilter<"MemorySession"> | Date | string
  }

  export type MemorySessionOrderByWithRelationInput = {
    id?: SortOrder
    algorithm?: SortOrder
    stageType?: SortOrderInput | SortOrder
    mode?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    processed?: SortOrder
    unprocessed?: SortOrder
    createdAt?: SortOrder
  }

  export type MemorySessionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: MemorySessionWhereInput | MemorySessionWhereInput[]
    OR?: MemorySessionWhereInput[]
    NOT?: MemorySessionWhereInput | MemorySessionWhereInput[]
    algorithm?: StringFilter<"MemorySession"> | string
    stageType?: StringNullableFilter<"MemorySession"> | string | null
    mode?: StringFilter<"MemorySession"> | string
    score?: IntFilter<"MemorySession"> | number
    hearts?: IntFilter<"MemorySession"> | number
    processed?: IntFilter<"MemorySession"> | number
    unprocessed?: IntFilter<"MemorySession"> | number
    createdAt?: DateTimeFilter<"MemorySession"> | Date | string
  }, "id">

  export type MemorySessionOrderByWithAggregationInput = {
    id?: SortOrder
    algorithm?: SortOrder
    stageType?: SortOrderInput | SortOrder
    mode?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    processed?: SortOrder
    unprocessed?: SortOrder
    createdAt?: SortOrder
    _count?: MemorySessionCountOrderByAggregateInput
    _avg?: MemorySessionAvgOrderByAggregateInput
    _max?: MemorySessionMaxOrderByAggregateInput
    _min?: MemorySessionMinOrderByAggregateInput
    _sum?: MemorySessionSumOrderByAggregateInput
  }

  export type MemorySessionScalarWhereWithAggregatesInput = {
    AND?: MemorySessionScalarWhereWithAggregatesInput | MemorySessionScalarWhereWithAggregatesInput[]
    OR?: MemorySessionScalarWhereWithAggregatesInput[]
    NOT?: MemorySessionScalarWhereWithAggregatesInput | MemorySessionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"MemorySession"> | number
    algorithm?: StringWithAggregatesFilter<"MemorySession"> | string
    stageType?: StringNullableWithAggregatesFilter<"MemorySession"> | string | null
    mode?: StringWithAggregatesFilter<"MemorySession"> | string
    score?: IntWithAggregatesFilter<"MemorySession"> | number
    hearts?: IntWithAggregatesFilter<"MemorySession"> | number
    processed?: IntWithAggregatesFilter<"MemorySession"> | number
    unprocessed?: IntWithAggregatesFilter<"MemorySession"> | number
    createdAt?: DateTimeWithAggregatesFilter<"MemorySession"> | Date | string
  }

  export type CpuSessionWhereInput = {
    AND?: CpuSessionWhereInput | CpuSessionWhereInput[]
    OR?: CpuSessionWhereInput[]
    NOT?: CpuSessionWhereInput | CpuSessionWhereInput[]
    id?: IntFilter<"CpuSession"> | number
    algorithm?: StringFilter<"CpuSession"> | string
    mode?: StringFilter<"CpuSession"> | string
    avgWaitingTime?: FloatNullableFilter<"CpuSession"> | number | null
    avgTurnaround?: FloatNullableFilter<"CpuSession"> | number | null
    score?: IntFilter<"CpuSession"> | number
    hearts?: IntFilter<"CpuSession"> | number
    inputProcesses?: StringNullableFilter<"CpuSession"> | string | null
    quantum?: IntFilter<"CpuSession"> | number
    createdAt?: DateTimeFilter<"CpuSession"> | Date | string
  }

  export type CpuSessionOrderByWithRelationInput = {
    id?: SortOrder
    algorithm?: SortOrder
    mode?: SortOrder
    avgWaitingTime?: SortOrderInput | SortOrder
    avgTurnaround?: SortOrderInput | SortOrder
    score?: SortOrder
    hearts?: SortOrder
    inputProcesses?: SortOrderInput | SortOrder
    quantum?: SortOrder
    createdAt?: SortOrder
  }

  export type CpuSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CpuSessionWhereInput | CpuSessionWhereInput[]
    OR?: CpuSessionWhereInput[]
    NOT?: CpuSessionWhereInput | CpuSessionWhereInput[]
    algorithm?: StringFilter<"CpuSession"> | string
    mode?: StringFilter<"CpuSession"> | string
    avgWaitingTime?: FloatNullableFilter<"CpuSession"> | number | null
    avgTurnaround?: FloatNullableFilter<"CpuSession"> | number | null
    score?: IntFilter<"CpuSession"> | number
    hearts?: IntFilter<"CpuSession"> | number
    inputProcesses?: StringNullableFilter<"CpuSession"> | string | null
    quantum?: IntFilter<"CpuSession"> | number
    createdAt?: DateTimeFilter<"CpuSession"> | Date | string
  }, "id">

  export type CpuSessionOrderByWithAggregationInput = {
    id?: SortOrder
    algorithm?: SortOrder
    mode?: SortOrder
    avgWaitingTime?: SortOrderInput | SortOrder
    avgTurnaround?: SortOrderInput | SortOrder
    score?: SortOrder
    hearts?: SortOrder
    inputProcesses?: SortOrderInput | SortOrder
    quantum?: SortOrder
    createdAt?: SortOrder
    _count?: CpuSessionCountOrderByAggregateInput
    _avg?: CpuSessionAvgOrderByAggregateInput
    _max?: CpuSessionMaxOrderByAggregateInput
    _min?: CpuSessionMinOrderByAggregateInput
    _sum?: CpuSessionSumOrderByAggregateInput
  }

  export type CpuSessionScalarWhereWithAggregatesInput = {
    AND?: CpuSessionScalarWhereWithAggregatesInput | CpuSessionScalarWhereWithAggregatesInput[]
    OR?: CpuSessionScalarWhereWithAggregatesInput[]
    NOT?: CpuSessionScalarWhereWithAggregatesInput | CpuSessionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CpuSession"> | number
    algorithm?: StringWithAggregatesFilter<"CpuSession"> | string
    mode?: StringWithAggregatesFilter<"CpuSession"> | string
    avgWaitingTime?: FloatNullableWithAggregatesFilter<"CpuSession"> | number | null
    avgTurnaround?: FloatNullableWithAggregatesFilter<"CpuSession"> | number | null
    score?: IntWithAggregatesFilter<"CpuSession"> | number
    hearts?: IntWithAggregatesFilter<"CpuSession"> | number
    inputProcesses?: StringNullableWithAggregatesFilter<"CpuSession"> | string | null
    quantum?: IntWithAggregatesFilter<"CpuSession"> | number
    createdAt?: DateTimeWithAggregatesFilter<"CpuSession"> | Date | string
  }

  export type VmSessionWhereInput = {
    AND?: VmSessionWhereInput | VmSessionWhereInput[]
    OR?: VmSessionWhereInput[]
    NOT?: VmSessionWhereInput | VmSessionWhereInput[]
    id?: IntFilter<"VmSession"> | number
    algorithm?: StringFilter<"VmSession"> | string
    mode?: StringFilter<"VmSession"> | string
    totalRefs?: IntFilter<"VmSession"> | number
    pageFaults?: IntFilter<"VmSession"> | number
    hits?: IntFilter<"VmSession"> | number
    hitRatio?: FloatFilter<"VmSession"> | number
    score?: IntFilter<"VmSession"> | number
    hearts?: IntFilter<"VmSession"> | number
    inputRefString?: StringNullableFilter<"VmSession"> | string | null
    frameCount?: IntFilter<"VmSession"> | number
    createdAt?: DateTimeFilter<"VmSession"> | Date | string
  }

  export type VmSessionOrderByWithRelationInput = {
    id?: SortOrder
    algorithm?: SortOrder
    mode?: SortOrder
    totalRefs?: SortOrder
    pageFaults?: SortOrder
    hits?: SortOrder
    hitRatio?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    inputRefString?: SortOrderInput | SortOrder
    frameCount?: SortOrder
    createdAt?: SortOrder
  }

  export type VmSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: VmSessionWhereInput | VmSessionWhereInput[]
    OR?: VmSessionWhereInput[]
    NOT?: VmSessionWhereInput | VmSessionWhereInput[]
    algorithm?: StringFilter<"VmSession"> | string
    mode?: StringFilter<"VmSession"> | string
    totalRefs?: IntFilter<"VmSession"> | number
    pageFaults?: IntFilter<"VmSession"> | number
    hits?: IntFilter<"VmSession"> | number
    hitRatio?: FloatFilter<"VmSession"> | number
    score?: IntFilter<"VmSession"> | number
    hearts?: IntFilter<"VmSession"> | number
    inputRefString?: StringNullableFilter<"VmSession"> | string | null
    frameCount?: IntFilter<"VmSession"> | number
    createdAt?: DateTimeFilter<"VmSession"> | Date | string
  }, "id">

  export type VmSessionOrderByWithAggregationInput = {
    id?: SortOrder
    algorithm?: SortOrder
    mode?: SortOrder
    totalRefs?: SortOrder
    pageFaults?: SortOrder
    hits?: SortOrder
    hitRatio?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    inputRefString?: SortOrderInput | SortOrder
    frameCount?: SortOrder
    createdAt?: SortOrder
    _count?: VmSessionCountOrderByAggregateInput
    _avg?: VmSessionAvgOrderByAggregateInput
    _max?: VmSessionMaxOrderByAggregateInput
    _min?: VmSessionMinOrderByAggregateInput
    _sum?: VmSessionSumOrderByAggregateInput
  }

  export type VmSessionScalarWhereWithAggregatesInput = {
    AND?: VmSessionScalarWhereWithAggregatesInput | VmSessionScalarWhereWithAggregatesInput[]
    OR?: VmSessionScalarWhereWithAggregatesInput[]
    NOT?: VmSessionScalarWhereWithAggregatesInput | VmSessionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"VmSession"> | number
    algorithm?: StringWithAggregatesFilter<"VmSession"> | string
    mode?: StringWithAggregatesFilter<"VmSession"> | string
    totalRefs?: IntWithAggregatesFilter<"VmSession"> | number
    pageFaults?: IntWithAggregatesFilter<"VmSession"> | number
    hits?: IntWithAggregatesFilter<"VmSession"> | number
    hitRatio?: FloatWithAggregatesFilter<"VmSession"> | number
    score?: IntWithAggregatesFilter<"VmSession"> | number
    hearts?: IntWithAggregatesFilter<"VmSession"> | number
    inputRefString?: StringNullableWithAggregatesFilter<"VmSession"> | string | null
    frameCount?: IntWithAggregatesFilter<"VmSession"> | number
    createdAt?: DateTimeWithAggregatesFilter<"VmSession"> | Date | string
  }

  export type DiskSessionWhereInput = {
    AND?: DiskSessionWhereInput | DiskSessionWhereInput[]
    OR?: DiskSessionWhereInput[]
    NOT?: DiskSessionWhereInput | DiskSessionWhereInput[]
    id?: IntFilter<"DiskSession"> | number
    algorithm?: StringFilter<"DiskSession"> | string
    mode?: StringFilter<"DiskSession"> | string
    headStart?: IntFilter<"DiskSession"> | number
    totalMovement?: IntFilter<"DiskSession"> | number
    score?: IntFilter<"DiskSession"> | number
    hearts?: IntFilter<"DiskSession"> | number
    inputRequests?: StringNullableFilter<"DiskSession"> | string | null
    createdAt?: DateTimeFilter<"DiskSession"> | Date | string
  }

  export type DiskSessionOrderByWithRelationInput = {
    id?: SortOrder
    algorithm?: SortOrder
    mode?: SortOrder
    headStart?: SortOrder
    totalMovement?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    inputRequests?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type DiskSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: DiskSessionWhereInput | DiskSessionWhereInput[]
    OR?: DiskSessionWhereInput[]
    NOT?: DiskSessionWhereInput | DiskSessionWhereInput[]
    algorithm?: StringFilter<"DiskSession"> | string
    mode?: StringFilter<"DiskSession"> | string
    headStart?: IntFilter<"DiskSession"> | number
    totalMovement?: IntFilter<"DiskSession"> | number
    score?: IntFilter<"DiskSession"> | number
    hearts?: IntFilter<"DiskSession"> | number
    inputRequests?: StringNullableFilter<"DiskSession"> | string | null
    createdAt?: DateTimeFilter<"DiskSession"> | Date | string
  }, "id">

  export type DiskSessionOrderByWithAggregationInput = {
    id?: SortOrder
    algorithm?: SortOrder
    mode?: SortOrder
    headStart?: SortOrder
    totalMovement?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    inputRequests?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: DiskSessionCountOrderByAggregateInput
    _avg?: DiskSessionAvgOrderByAggregateInput
    _max?: DiskSessionMaxOrderByAggregateInput
    _min?: DiskSessionMinOrderByAggregateInput
    _sum?: DiskSessionSumOrderByAggregateInput
  }

  export type DiskSessionScalarWhereWithAggregatesInput = {
    AND?: DiskSessionScalarWhereWithAggregatesInput | DiskSessionScalarWhereWithAggregatesInput[]
    OR?: DiskSessionScalarWhereWithAggregatesInput[]
    NOT?: DiskSessionScalarWhereWithAggregatesInput | DiskSessionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DiskSession"> | number
    algorithm?: StringWithAggregatesFilter<"DiskSession"> | string
    mode?: StringWithAggregatesFilter<"DiskSession"> | string
    headStart?: IntWithAggregatesFilter<"DiskSession"> | number
    totalMovement?: IntWithAggregatesFilter<"DiskSession"> | number
    score?: IntWithAggregatesFilter<"DiskSession"> | number
    hearts?: IntWithAggregatesFilter<"DiskSession"> | number
    inputRequests?: StringNullableWithAggregatesFilter<"DiskSession"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"DiskSession"> | Date | string
  }

  export type MemorySessionCreateInput = {
    algorithm: string
    stageType?: string | null
    mode: string
    score?: number
    hearts?: number
    processed?: number
    unprocessed?: number
    createdAt?: Date | string
  }

  export type MemorySessionUncheckedCreateInput = {
    id?: number
    algorithm: string
    stageType?: string | null
    mode: string
    score?: number
    hearts?: number
    processed?: number
    unprocessed?: number
    createdAt?: Date | string
  }

  export type MemorySessionUpdateInput = {
    algorithm?: StringFieldUpdateOperationsInput | string
    stageType?: NullableStringFieldUpdateOperationsInput | string | null
    mode?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    hearts?: IntFieldUpdateOperationsInput | number
    processed?: IntFieldUpdateOperationsInput | number
    unprocessed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemorySessionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    algorithm?: StringFieldUpdateOperationsInput | string
    stageType?: NullableStringFieldUpdateOperationsInput | string | null
    mode?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    hearts?: IntFieldUpdateOperationsInput | number
    processed?: IntFieldUpdateOperationsInput | number
    unprocessed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemorySessionCreateManyInput = {
    id?: number
    algorithm: string
    stageType?: string | null
    mode: string
    score?: number
    hearts?: number
    processed?: number
    unprocessed?: number
    createdAt?: Date | string
  }

  export type MemorySessionUpdateManyMutationInput = {
    algorithm?: StringFieldUpdateOperationsInput | string
    stageType?: NullableStringFieldUpdateOperationsInput | string | null
    mode?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    hearts?: IntFieldUpdateOperationsInput | number
    processed?: IntFieldUpdateOperationsInput | number
    unprocessed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MemorySessionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    algorithm?: StringFieldUpdateOperationsInput | string
    stageType?: NullableStringFieldUpdateOperationsInput | string | null
    mode?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    hearts?: IntFieldUpdateOperationsInput | number
    processed?: IntFieldUpdateOperationsInput | number
    unprocessed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CpuSessionCreateInput = {
    algorithm: string
    mode: string
    avgWaitingTime?: number | null
    avgTurnaround?: number | null
    score?: number
    hearts?: number
    inputProcesses?: string | null
    quantum?: number
    createdAt?: Date | string
  }

  export type CpuSessionUncheckedCreateInput = {
    id?: number
    algorithm: string
    mode: string
    avgWaitingTime?: number | null
    avgTurnaround?: number | null
    score?: number
    hearts?: number
    inputProcesses?: string | null
    quantum?: number
    createdAt?: Date | string
  }

  export type CpuSessionUpdateInput = {
    algorithm?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    avgWaitingTime?: NullableFloatFieldUpdateOperationsInput | number | null
    avgTurnaround?: NullableFloatFieldUpdateOperationsInput | number | null
    score?: IntFieldUpdateOperationsInput | number
    hearts?: IntFieldUpdateOperationsInput | number
    inputProcesses?: NullableStringFieldUpdateOperationsInput | string | null
    quantum?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CpuSessionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    algorithm?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    avgWaitingTime?: NullableFloatFieldUpdateOperationsInput | number | null
    avgTurnaround?: NullableFloatFieldUpdateOperationsInput | number | null
    score?: IntFieldUpdateOperationsInput | number
    hearts?: IntFieldUpdateOperationsInput | number
    inputProcesses?: NullableStringFieldUpdateOperationsInput | string | null
    quantum?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CpuSessionCreateManyInput = {
    id?: number
    algorithm: string
    mode: string
    avgWaitingTime?: number | null
    avgTurnaround?: number | null
    score?: number
    hearts?: number
    inputProcesses?: string | null
    quantum?: number
    createdAt?: Date | string
  }

  export type CpuSessionUpdateManyMutationInput = {
    algorithm?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    avgWaitingTime?: NullableFloatFieldUpdateOperationsInput | number | null
    avgTurnaround?: NullableFloatFieldUpdateOperationsInput | number | null
    score?: IntFieldUpdateOperationsInput | number
    hearts?: IntFieldUpdateOperationsInput | number
    inputProcesses?: NullableStringFieldUpdateOperationsInput | string | null
    quantum?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CpuSessionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    algorithm?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    avgWaitingTime?: NullableFloatFieldUpdateOperationsInput | number | null
    avgTurnaround?: NullableFloatFieldUpdateOperationsInput | number | null
    score?: IntFieldUpdateOperationsInput | number
    hearts?: IntFieldUpdateOperationsInput | number
    inputProcesses?: NullableStringFieldUpdateOperationsInput | string | null
    quantum?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VmSessionCreateInput = {
    algorithm: string
    mode: string
    totalRefs: number
    pageFaults: number
    hits: number
    hitRatio: number
    score?: number
    hearts?: number
    inputRefString?: string | null
    frameCount?: number
    createdAt?: Date | string
  }

  export type VmSessionUncheckedCreateInput = {
    id?: number
    algorithm: string
    mode: string
    totalRefs: number
    pageFaults: number
    hits: number
    hitRatio: number
    score?: number
    hearts?: number
    inputRefString?: string | null
    frameCount?: number
    createdAt?: Date | string
  }

  export type VmSessionUpdateInput = {
    algorithm?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    totalRefs?: IntFieldUpdateOperationsInput | number
    pageFaults?: IntFieldUpdateOperationsInput | number
    hits?: IntFieldUpdateOperationsInput | number
    hitRatio?: FloatFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    hearts?: IntFieldUpdateOperationsInput | number
    inputRefString?: NullableStringFieldUpdateOperationsInput | string | null
    frameCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VmSessionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    algorithm?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    totalRefs?: IntFieldUpdateOperationsInput | number
    pageFaults?: IntFieldUpdateOperationsInput | number
    hits?: IntFieldUpdateOperationsInput | number
    hitRatio?: FloatFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    hearts?: IntFieldUpdateOperationsInput | number
    inputRefString?: NullableStringFieldUpdateOperationsInput | string | null
    frameCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VmSessionCreateManyInput = {
    id?: number
    algorithm: string
    mode: string
    totalRefs: number
    pageFaults: number
    hits: number
    hitRatio: number
    score?: number
    hearts?: number
    inputRefString?: string | null
    frameCount?: number
    createdAt?: Date | string
  }

  export type VmSessionUpdateManyMutationInput = {
    algorithm?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    totalRefs?: IntFieldUpdateOperationsInput | number
    pageFaults?: IntFieldUpdateOperationsInput | number
    hits?: IntFieldUpdateOperationsInput | number
    hitRatio?: FloatFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    hearts?: IntFieldUpdateOperationsInput | number
    inputRefString?: NullableStringFieldUpdateOperationsInput | string | null
    frameCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VmSessionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    algorithm?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    totalRefs?: IntFieldUpdateOperationsInput | number
    pageFaults?: IntFieldUpdateOperationsInput | number
    hits?: IntFieldUpdateOperationsInput | number
    hitRatio?: FloatFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    hearts?: IntFieldUpdateOperationsInput | number
    inputRefString?: NullableStringFieldUpdateOperationsInput | string | null
    frameCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiskSessionCreateInput = {
    algorithm: string
    mode: string
    headStart?: number
    totalMovement: number
    score?: number
    hearts?: number
    inputRequests?: string | null
    createdAt?: Date | string
  }

  export type DiskSessionUncheckedCreateInput = {
    id?: number
    algorithm: string
    mode: string
    headStart?: number
    totalMovement: number
    score?: number
    hearts?: number
    inputRequests?: string | null
    createdAt?: Date | string
  }

  export type DiskSessionUpdateInput = {
    algorithm?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    headStart?: IntFieldUpdateOperationsInput | number
    totalMovement?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    hearts?: IntFieldUpdateOperationsInput | number
    inputRequests?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiskSessionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    algorithm?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    headStart?: IntFieldUpdateOperationsInput | number
    totalMovement?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    hearts?: IntFieldUpdateOperationsInput | number
    inputRequests?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiskSessionCreateManyInput = {
    id?: number
    algorithm: string
    mode: string
    headStart?: number
    totalMovement: number
    score?: number
    hearts?: number
    inputRequests?: string | null
    createdAt?: Date | string
  }

  export type DiskSessionUpdateManyMutationInput = {
    algorithm?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    headStart?: IntFieldUpdateOperationsInput | number
    totalMovement?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    hearts?: IntFieldUpdateOperationsInput | number
    inputRequests?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiskSessionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    algorithm?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    headStart?: IntFieldUpdateOperationsInput | number
    totalMovement?: IntFieldUpdateOperationsInput | number
    score?: IntFieldUpdateOperationsInput | number
    hearts?: IntFieldUpdateOperationsInput | number
    inputRequests?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type MemorySessionCountOrderByAggregateInput = {
    id?: SortOrder
    algorithm?: SortOrder
    stageType?: SortOrder
    mode?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    processed?: SortOrder
    unprocessed?: SortOrder
    createdAt?: SortOrder
  }

  export type MemorySessionAvgOrderByAggregateInput = {
    id?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    processed?: SortOrder
    unprocessed?: SortOrder
  }

  export type MemorySessionMaxOrderByAggregateInput = {
    id?: SortOrder
    algorithm?: SortOrder
    stageType?: SortOrder
    mode?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    processed?: SortOrder
    unprocessed?: SortOrder
    createdAt?: SortOrder
  }

  export type MemorySessionMinOrderByAggregateInput = {
    id?: SortOrder
    algorithm?: SortOrder
    stageType?: SortOrder
    mode?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    processed?: SortOrder
    unprocessed?: SortOrder
    createdAt?: SortOrder
  }

  export type MemorySessionSumOrderByAggregateInput = {
    id?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    processed?: SortOrder
    unprocessed?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type CpuSessionCountOrderByAggregateInput = {
    id?: SortOrder
    algorithm?: SortOrder
    mode?: SortOrder
    avgWaitingTime?: SortOrder
    avgTurnaround?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    inputProcesses?: SortOrder
    quantum?: SortOrder
    createdAt?: SortOrder
  }

  export type CpuSessionAvgOrderByAggregateInput = {
    id?: SortOrder
    avgWaitingTime?: SortOrder
    avgTurnaround?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    quantum?: SortOrder
  }

  export type CpuSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    algorithm?: SortOrder
    mode?: SortOrder
    avgWaitingTime?: SortOrder
    avgTurnaround?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    inputProcesses?: SortOrder
    quantum?: SortOrder
    createdAt?: SortOrder
  }

  export type CpuSessionMinOrderByAggregateInput = {
    id?: SortOrder
    algorithm?: SortOrder
    mode?: SortOrder
    avgWaitingTime?: SortOrder
    avgTurnaround?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    inputProcesses?: SortOrder
    quantum?: SortOrder
    createdAt?: SortOrder
  }

  export type CpuSessionSumOrderByAggregateInput = {
    id?: SortOrder
    avgWaitingTime?: SortOrder
    avgTurnaround?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    quantum?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type VmSessionCountOrderByAggregateInput = {
    id?: SortOrder
    algorithm?: SortOrder
    mode?: SortOrder
    totalRefs?: SortOrder
    pageFaults?: SortOrder
    hits?: SortOrder
    hitRatio?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    inputRefString?: SortOrder
    frameCount?: SortOrder
    createdAt?: SortOrder
  }

  export type VmSessionAvgOrderByAggregateInput = {
    id?: SortOrder
    totalRefs?: SortOrder
    pageFaults?: SortOrder
    hits?: SortOrder
    hitRatio?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    frameCount?: SortOrder
  }

  export type VmSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    algorithm?: SortOrder
    mode?: SortOrder
    totalRefs?: SortOrder
    pageFaults?: SortOrder
    hits?: SortOrder
    hitRatio?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    inputRefString?: SortOrder
    frameCount?: SortOrder
    createdAt?: SortOrder
  }

  export type VmSessionMinOrderByAggregateInput = {
    id?: SortOrder
    algorithm?: SortOrder
    mode?: SortOrder
    totalRefs?: SortOrder
    pageFaults?: SortOrder
    hits?: SortOrder
    hitRatio?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    inputRefString?: SortOrder
    frameCount?: SortOrder
    createdAt?: SortOrder
  }

  export type VmSessionSumOrderByAggregateInput = {
    id?: SortOrder
    totalRefs?: SortOrder
    pageFaults?: SortOrder
    hits?: SortOrder
    hitRatio?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    frameCount?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DiskSessionCountOrderByAggregateInput = {
    id?: SortOrder
    algorithm?: SortOrder
    mode?: SortOrder
    headStart?: SortOrder
    totalMovement?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    inputRequests?: SortOrder
    createdAt?: SortOrder
  }

  export type DiskSessionAvgOrderByAggregateInput = {
    id?: SortOrder
    headStart?: SortOrder
    totalMovement?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
  }

  export type DiskSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    algorithm?: SortOrder
    mode?: SortOrder
    headStart?: SortOrder
    totalMovement?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    inputRequests?: SortOrder
    createdAt?: SortOrder
  }

  export type DiskSessionMinOrderByAggregateInput = {
    id?: SortOrder
    algorithm?: SortOrder
    mode?: SortOrder
    headStart?: SortOrder
    totalMovement?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
    inputRequests?: SortOrder
    createdAt?: SortOrder
  }

  export type DiskSessionSumOrderByAggregateInput = {
    id?: SortOrder
    headStart?: SortOrder
    totalMovement?: SortOrder
    score?: SortOrder
    hearts?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}