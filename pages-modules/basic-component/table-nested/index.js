import { Table, Badge, Menu, Dropdown, Space } from 'antd';

function NestedTable({data}) {
  const expandedRowRender = (data) => {
    
const columnsChildGrade = [
    {
        title: "Mã số sinh viên",
        dataIndex: "idStudent",
        key: "idStudent"
    },
    {
        title: "Điểm",
        dataIndex: "grade",
        key: "grade"
    }
]

    return <Table columns={columnsChildGrade} dataSource={d} pagination={false} />;
  };



  const columnsAssigment = [
    {
        title: 'Bài kiểm tra',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: "Số lượng",
        dataIndex: 'submissions',
        key: 'submissions',
        render: data => {
            console.log('data', data);
            return <span>{data.length || 0}</span>
        }
    }
]

  return (
    <Table
      className="components-table-demo-nested"
      columns={columnsAssigment}
      expandable={{ expandedRowRender }}
      dataSource={data}
    />
  );
}

export default NestedTable;
