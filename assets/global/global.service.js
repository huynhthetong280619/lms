class GlobalService{
    constructor(){
        this.isTeacher = true;
        this.lang = 'vi',
        this.token = null
    }
}

const theInstance = new GlobalService()

export default theInstance;
