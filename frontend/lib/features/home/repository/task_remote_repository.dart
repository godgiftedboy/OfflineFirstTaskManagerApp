import 'dart:convert';

import 'package:frontend/core/constants/constants.dart';
import 'package:frontend/core/constants/utils.dart';
import 'package:frontend/models/task_model.dart';
import 'package:http/http.dart' as http;
import 'package:uuid/uuid.dart';

class TaskRemoteRepository {
  Future<TaskModel> createTask({
    required String title,
    required String description,
    required String hexColor,
    required String token,
    required String uid,
    required DateTime dueAt,
  }) async {
    try {
      final res = await http.post(Uri.parse("${Constants.backendUri}/tasks"),
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: jsonEncode(
            {
              'title': title,
              'description': description,
              'hexColor': hexColor,
              'dueAt': dueAt.toIso8601String(),
            },
          ));

      if (res.statusCode != 201) {
        throw jsonDecode(res.body)['error'];
      }

      return TaskModel.fromJson(res.body);
    } catch (e) {
      try {
        final taskModel = TaskModel(
          id: const Uuid().v6(),
          uid: uid,
          title: title,
          description: description,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
          dueAt: dueAt,
          color: hexToRgb(hexColor),
          isSynced: 0,
        );
        return taskModel;
      } catch (e) {
        rethrow;
      }
    }
  }

  Future<List<TaskModel>> getTasks({required String token}) async {
    try {
      final res = await http.get(
        Uri.parse("${Constants.backendUri}/tasks"),
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      );

      if (res.statusCode != 200) {
        throw jsonDecode(res.body)['error'];
      }

      final listOfTasks = jsonDecode(res.body);
      List<TaskModel> tasksList = [];

      for (var elem in listOfTasks) {
        tasksList.add(TaskModel.fromMap(elem));
      }

      return tasksList;
    } catch (e) {
      rethrow;
    }
  }
}
