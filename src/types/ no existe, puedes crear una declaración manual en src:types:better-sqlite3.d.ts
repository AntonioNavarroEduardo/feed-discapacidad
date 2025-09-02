declare module 'better-sqlite3' {
  export interface Database {
    prepare(sql: string): Statement;
    close(): void;
  }
  
  export interface Statement {
    run(...params: any[]): RunResult;
    all(...params: any[]): any[];
    get(...params: any[]): any;
  }
  
  export interface RunResult {
    changes: number;
    lastInsertRowid: number;
  }
  
  export interface DatabaseOptions {
    readonly?: boolean;
    fileMustExist?: boolean;
    timeout?: number;
  }
  
  interface DatabaseConstructor {
    new (path: string, options?: DatabaseOptions): Database;
    (path: string, options?: DatabaseOptions): Database;
  }
  
  const Database: DatabaseConstructor;
  export = Database;
}
