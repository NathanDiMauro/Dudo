

const Notification = (props) => {
    if (props.show || !props.notification.title) return null;

    return (
        <div style={styles.container}>
            <h4>{props.notification.title}</h4>
            <p>{props.notification.description}</p>
        </div>
    )
}

const styles = {
    container: {
        marginLeft: 50,
        marginRight: 50,
        borderColor: '#004c8c',
        borderRadius: 5,
        borderStyle: 'solid',
        borderWidth: 5,
        padding: 5,
        width: '25%',
        marginBottom: 10
    }
}


export default Notification;