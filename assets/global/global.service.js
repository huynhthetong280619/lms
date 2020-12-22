class GlobalService {
    constructor() {
        this.isTeacher = false;
        this.lang = 'vi'
    }
}

const theInstance = new GlobalService()

export default theInstance;