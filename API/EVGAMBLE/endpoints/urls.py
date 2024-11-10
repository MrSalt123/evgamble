from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from endpoints import views
from .views import *

user_detail = views.UserViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update'
})

urlpatterns = [
    path('Verify/<str:email>', views.verify_email),
    path('News/', views.get_news),
    path('Register/', views.register_user),
    path('Login/', views.login_user),
    path('User/', user_detail, name='user-detail'),
    path('Logout/', views.logout_user),
    path('Authenticated/', views.user_authenticated),
    path('Sessions/', PokerSessionListCreate.as_view(), name='session-list-create'),
    path('Sessions/<int:pk>/', PokerSessionDetail.as_view(), name='session-detail')
]

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'html'])
