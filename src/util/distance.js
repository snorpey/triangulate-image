export default ( a, b ) => {
	let dx = b.x - a.x;
	let dy = b.y - a.y;

	return Math.sqrt( ( dx * dx ) + ( dy * dy ) );
}