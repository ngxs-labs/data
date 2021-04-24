/**
 * @privateApi
 */
export const enum NgxsDataExceptions {
    NGXS_PERSISTENCE_STATE = '@Persistence should be add before decorator @State and @StateRepository',
    NGXS_DATA_STATE = '@StateRepository should be add before decorator @State',
    NGXS_DATA_STATE_NAME_NOT_FOUND = 'State name not provided in class',
    NGXS_DATA_MODULE_EXCEPTION = 'Metadata not created \n Maybe you forgot to import the NgxsDataPluginModule' +
        '\n Also, you cannot use this.ctx.* until the application is fully rendered ' +
        '\n (use by default ngxsOnInit(ctx: StateContext), or ngxsAfterBootstrap(ctx: StateContext) !!!',
    NGXS_DATA_STATE_DECORATOR = 'You forgot add decorator @StateRepository or initialize state!' +
        '\nExample: NgxsModule.forRoot([ .. ]), or NgxsModule.forFeature([ .. ])',
    NGXS_DATA_STATIC_ACTION = 'Cannot support static methods with @DataAction()',
    NGXS_DATA_ACTION = '@DataAction() can only decorate a method implementation',
    NGXS_DATA_ASYNC_ACTION_RETURN_TYPE = 'WARNING: If you use asynchronous actions' +
        ' `@Debounce() @DataAction()` the return result type should only void instead:',
    NGXS_PERSISTENCE_CONTAINER = 'You forgot provide NGXS_DATA_STORAGE_CONTAINER or NGXS_DATA_STORAGE_EXTENSION!!! Example: \n' +
        '\n@NgModule({' +
        '\n imports: [ ' +
        '\n   NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_PLUGIN]) ' +
        '\n ]\n' +
        '})' +
        '\nexport class AppModule {} \n\n',
    NGXS_PERSISTENCE_ENGINE = 'Not found storage engine from `existingEngine` or not found instance after injecting by `useClass`.',
    NGXS_PERSISTENCE_SERIALIZE = 'Error occurred while serializing value',
    NGXS_PERSISTENCE_DESERIALIZE = 'Error occurred while deserializing value',
    NGXS_DATA_CHILDREN_CONVERT = 'Child states can only be added to an object',
    NGXS_INVALID_PAYLOAD_NAME = 'Payload name should be initialized',
    NGXS_INVALID_ARG_NAME = 'Argument name should be initialized',
    NGXS_COMPUTED_DECORATOR = 'The method must be a getter for the computed decorator to work properly.',
    NGXS_COMPARE = 'You must set the compare function before sorting.'
}
