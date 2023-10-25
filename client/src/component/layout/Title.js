export default function Title({ content }) {
    return (
        <h1 style={{
            textAlign: 'center',
            fontSize: 28,
            fontWeight: 700,
            marginTop:0, 
            marginBottom:0, 
        }}>
            {content}
        </h1>
    );
}

