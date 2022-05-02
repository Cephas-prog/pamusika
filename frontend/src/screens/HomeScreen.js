/** @format */

import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';
import { useReducer, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import data from '../data';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return {...state, loading: true};
		case 'FETCH_SUCCESS':
			return {...state, products: action.payload, loading: false};
		case 'FETCH_FAIL':
			return {...state, loading: false, error: action.payload};
		default:
			return state;			
	}
}

export default function HomeScreen() {

	const [{loading, error, products}, dispatch] = useReducer(logger(reducer), {
		products: [],
		loading: true, error: '',
	})
	// const [products, setProducts] = useState([]);
	useEffect(()=>{
		const fetchData = async () => {
			dispatch({type: 'FETCH_REQUEST'});
			try {
				const result = await axios.get('/api/products');
				dispatch({type:'FETCH_SUCCESS', payload: result.data});
			} catch (error) {
				dispatch({type: 'FETCH_FAIL', payload: error.message})
			}
			
			// setProducts(result.data);
		};
		fetchData();
	 }, []);
	return (
		<div>
			<h1>Featured Products</h1>
			<div className='products'>			
				{
					loading? <div>loading...</div>
					:
					error? (
						<div>{error}</div>
					) :
						<Row>
					{products.map((product) => (
						<Col sm={6} md={4} lg={3}>
					<div className='product' key={product.slug}>
						<Link to={`/product/${product.slug}`}>
							<img src={product.image} alt={product.name} />
						</Link>
						<div className='productInfo'>
							<Link to={`/product/${product.slug}`}>
								<p>{product.name}</p>
							</Link>
							<p>£{product.price}</p>
							<button>Add to cart</button>
						</div>
					</div>
					</Col>
				))}
				</Row>
				})
			</div>
		</div>
	);
}
