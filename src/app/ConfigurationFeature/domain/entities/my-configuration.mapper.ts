import { MyConfiguration } from "./my-configuration.entity";

export class MyConfigurationMapper {
    static fromJson(configData: any): MyConfiguration {
        return new MyConfiguration(
            configData?.primaryColor || '#000000');
    }

    static toJson(config: MyConfiguration): any {
        return {
            primaryColor: config.primaryColor
        };
    }
}
