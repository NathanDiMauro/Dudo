

const LatestBid = (props) => {
    if (props.show || !props.bid) return null;

    console.log(props.bid);

    return (
        <div style={styles.container}>
            <h2>Latest Bid:</h2>
            <h4>{props.bid.bid.amount} {props.bid.bid.dice}s</h4>
        </div>
    )
}

const styles = {
    container: {
        marginLeft: 50,
        marginRight: 50,
        borderColor: 'black',
        borderRadius: 5,
        borderStyle: 'solid',
        padding: 5,
        width: '25%'
    }
}

export default LatestBid;