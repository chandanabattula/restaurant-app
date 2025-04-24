import {useState, useEffect} from 'react'

import Header from '../Header'
import DishItem from '../DishItem'

import './index.css'

class Home extends Component {
  state = {
    isLoading: true,
    response: [],
    activeCategoryId: '',
    cartItems: [],
  }

  componentDidMount() {
    this.fetchRestaurantApi()
  }

  addItemToCart = dish => {
    const {cartItems} = this.state
    const isAlreadyExists = cartItems.find(item => item.dishId === dish.dishId)
    if (!isAlreadyExists) {
      const newDish = {...dish, quantity: 1}
      this.setState({cartItems: [...cartItems, newDish]})
    } else {
      const updatedCart = cartItems.map(item =>
        item.dishId === dish.dishId
          ? {...item, quantity: item.quantity + 1}
          : item,
      )
      this.setState({cartItems: updatedCart})
    }
  }

  removeItemFromCart = dish => {
    const {cartItems} = this.state
    const updatedCart = cartItems
      .map(item =>
        item.dishId === dish.dishId
          ? {...item, quantity: item.quantity - 1}
          : item,
      )
      .filter(item => item.quantity > 0)
    this.setState({cartItems: updatedCart})
  }

  getUpdatedData = tableMenuList =>
    tableMenuList.map(eachMenu => ({
      menuCategory: eachMenu.menu_category,
      menuCategoryId: eachMenu.menu_category_id,
      menuCategoryImage: eachMenu.menu_category_image,
      categoryDishes: eachMenu.category_dishes.map(eachDish => ({
        dishId: eachDish.dish_id,
        dishName: eachDish.dish_name,
        dishPrice: eachDish.dish_price,
        dishImage: eachDish.dish_image,
        dishCurrency: eachDish.dish_currency,
        dishCalories: eachDish.dish_calories,
        dishDescription: eachDish.dish_description,
        dishAvailability: eachDish.dish_Availability,
        dishType: eachDish.dish_Type,
        addonCat: eachDish.addonCat,
      })),
    }))

  fetchRestaurantApi = async () => {
    const api = 'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'
    const apiResponse = await fetch(api)
    const data = await apiResponse.json()
    const updatedData = this.getUpdatedData(data[0].table_menu_list)
    this.setState({
      response: updatedData,
      activeCategoryId: updatedData[0].menuCategoryId,
      isLoading: false,
    })
  }

  onUpdateActiveCategoryIdx = menuCategoryId => {
    this.setState({activeCategoryId: menuCategoryId})
  }

  renderTabMenuList = () => {
    const {response, activeCategoryId} = this.state
    return response.map(eachCategory => {
      const onClickHandler = () =>
        this.onUpdateActiveCategoryIdx(eachCategory.menuCategoryId)

      return (
        <li
          className={`each-tab-item ${
            eachCategory.menuCategoryId === activeCategoryId
              ? 'active-tab-item'
              : ''
          }`}
          key={eachCategory.menuCategoryId}
          onClick={onClickHandler}
        >
          <button
            type="button"
            className="mt-0 mb-0 ms-2 me-2 tab-category-button"
          >
            {eachCategory.menuCategory}
          </button>
        </li>
      )
    })
  }

  renderDishes = () => {
    const {response, activeCategoryId, cartItems} = this.state
    const activeCategory = response.find(
      eachCategory => eachCategory.menuCategoryId === activeCategoryId,
    )

    if (!activeCategory) return null

    return (
      <ul className="m-0 d-flex flex-column dishes-list-container">
        {activeCategory.categoryDishes.map(eachDish => (
          <DishItem
            key={eachDish.dishId}
            dishDetails={eachDish}
            cartItems={cartItems}
            addItemToCart={this.addItemToCart}
            removeItemFromCart={this.removeItemFromCart}
          />
        ))}
      </ul>
    )
  }

  renderSpinner = () => (
    <div className="spinner-container">
      <div className="spinner-border" role="status" />
    </div>
  )

  render() {
    const {isLoading, cartItems} = this.state
    return isLoading ? (
      this.renderSpinner()
    ) : (
      <div className="home-background">
        <Header cartItems={cartItems} />
        <ul className="m-0 ps-0 d-flex tab-container">{this.renderTabMenuList()}</ul>
        {this.renderDishes()}
      </div>
    )
  }
}


export default Home
