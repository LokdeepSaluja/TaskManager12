from django.db import models
from django.contrib.auth.models import AbstractUser 

from django.contrib.auth.models import User
from django.conf import settings
# Create your models here.


class Task(models.Model):
    options=[
        ('C','COMPLETED'),
        ('P','PENDING'),
    ]

    title=models.CharField(max_length=50)
    description=models.TextField(null=True)
    status=models.CharField(max_length=2, choices=options)
    task_creator=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='task_creator')
    user=models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='task_assigned')
    date=models.DateTimeField(auto_now_add=True)


class User(AbstractUser):
    # username = None
    name=models.CharField(max_length=255)
    email=models.CharField(max_length=255,unique=True,)
    password=models.CharField(max_length=255)
    username = None
    USERNAME_FIELD = "email"
    # USERNAME_FIELD='email'
    REQUIRED_FIELDS=[""]

class Comments(models.Model):
    description=models.TextField(max_length=255)
    user_id=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    task_id=models.ForeignKey(Task, on_delete=models.CASCADE)
    user_name = models.CharField(max_length=255, blank=True, null=True)
