class GlobalService{
    constructor(){
        this.isTeacher = true;
        this.lang = 'vi'
    }
}

const theInstance = new GlobalService()

export default theInstance;
