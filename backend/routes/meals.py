from fastapi import APIRouter

router = APIRouter(prefix="/Meals", tags=["Meals"])

meals = [
    {
        "id": 1,
        "mealPlanId": 101,
        "name": "Chicken Salad",
        "calories": 400,
        "protein": 30,
        "carbs": 20,
        "fat": 10,
        "mealType": "lunch",
        "isCompleted": False,
        "imageUrl": None
    }
]

@router.get("/today")
def get_today_meals():
    return meals

@router.get("/weekly")
def get_weekly_meals():
    return meals

@router.get("/monthly")
def get_monthly_meals():
    return meals

@router.get("/{meal_id}/details")
def get_meal_details(meal_id: int):
    return next((m for m in meals if m["id"] == meal_id), None)

@router.patch("/{meal_plan_id}/complete")
def complete_meal(meal_plan_id: int):
    return {"message": f"Meal {meal_plan_id} marked as completed"}

@router.patch("/{meal_plan_id}/uncomplete")
def uncomplete_meal(meal_plan_id: int):
    return {"message": f"Meal {meal_plan_id} marked as uncompleted"}

@router.get("/daily-summary")
def daily_summary():
    return {
        "date": "2026-05-28",
        "totalCalories": 650,
        "totalProtein": 40,
        "totalCarbs": 60,
        "totalFat": 15,
        "completedMeals": 1
    }