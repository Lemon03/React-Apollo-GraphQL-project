import React from 'react';

export default function PageContainer({ children }) {
    return (
        <div style={{
            marginLeft: '15%',
            marginRight: '15%', 
            marginTop: 0,
            borderRight: 'solid',
            borderLeft: 'solid',
            borderBottom: 'solid',
            borderWidth: 3,
            padding: 20,
        }}>
            {children}
        </div>
    );
}