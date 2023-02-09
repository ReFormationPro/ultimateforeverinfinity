//https://stackoverflow.com/a/30174079/10713877


export default function Singleton<T>(value: T): T {
    class Singleton {
        private static instance: Singleton;
        value: T;
        private constructor(value: T) {
            this.value = value;
        }
        static {
            this.instance = undefined;
        }
        static getInstance(value: T): T {
            if (this.instance === undefined) {
                Singleton.instance = new Singleton(value);
            }
            return Singleton.instance.value;
        }
    };
    return Singleton.getInstance(value);
}


