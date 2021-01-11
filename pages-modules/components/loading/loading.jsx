import { Spin, Alert } from 'antd'
const Loading = () => {
    return (
        <Spin spinning>
            <Alert
                message="Lấy dữ liệu từ server"
                description="Hoạt động có thể chậm do mạng..."
                type="info"
            />
        </Spin>
    )
}
export default Loading;