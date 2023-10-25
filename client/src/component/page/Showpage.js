import { Button, Table } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import Title from "../layout/Title";
import PageContainer from "../layout/PageContainer";
import { PERSON_WITH_CAR } from '../../graphql/Query'
import { useQuery } from '@apollo/client'

export default function Showpage() {
    const { id } = useParams();
    const navigate = useNavigate();
	const goBack = () => {
		navigate(-1);
	}

    const personId = id;
    const { error, data, loading } = useQuery(PERSON_WITH_CAR, {
        variables: { personId }
    });

    if (loading) return 'Loading...';
    if (error) return `${error.message}`
    console.log('data', data)

    const columns = [
        {
          title: 'Year',
          dataIndex: 'year',
          key: 'year',
        },
        {
          title: 'Make',
          dataIndex: 'make',
          key: 'make',
        },
        {
          title: 'Model',
          dataIndex: 'model',
          key: 'model',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${price}`
        },
        
    ];

    return (
        <>
        <PageContainer>
            <Button type="primary" size="large" onClick={goBack}>Back</Button>	
            <Title content={`${data.person.firstName} ${data.person.lastName}`} />
            <Table columns={columns} dataSource={data.person.cars} style={{marginTop:20}}/>
        </PageContainer>
        </>
    );
}




