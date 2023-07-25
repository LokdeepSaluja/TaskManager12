
from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from .views import home,signup,login,add_task,signout,delete_task,change_task,delete_user,add_comment,gettask,assign_user,delete_comment

urlpatterns = [
     path('',home , name="home"),
     path('signup/',signup),
     path('login/',login,name='login'),
     # path('add-task/',add_task),
     path('add-task/', add_task, name='add_task'),
     path('logout/',signout),
     path('delete-task/<int:id>',delete_task),
     path('delete-user',delete_user),
     path('task<int:id>/add-comment',add_comment),
     path('change-status/<int:id>',change_task),
     path('assign-user/<int:id>',assign_user),
     path('delete-comment/<int:id>',delete_comment),
     path('task<int:id>',gettask)
]
