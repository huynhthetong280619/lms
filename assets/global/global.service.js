class GlobalService{
    constructor(){
        this.isTeacher = false;
        this.lang = 'vi',
        this.token = null
    }
}

const theInstance = new GlobalService()

export default theInstance;
