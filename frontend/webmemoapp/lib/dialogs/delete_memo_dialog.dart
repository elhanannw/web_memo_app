import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:webmemoapp/utils/dependencies.dart' as dependencies;

class DeleteMemoDialog extends StatefulWidget {
    final int index;
    final Function scrollToBottom;
    const DeleteMemoDialog({
        required this.index,
        required this.scrollToBottom,
        super.key,
    });

    @override
    State<DeleteMemoDialog> createState() => DeleteMemoDialogState();
}

class DeleteMemoDialogState extends State<DeleteMemoDialog> {
    RxString status = 'delete-memo'.obs;
    var memoController = TextEditingController();

    Widget deleteMemoWidget() {
        return Center(
            child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                    const Text(
                        "Delete this memo?"
                    ),
                    const SizedBox(height: 20),
                    Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                            ElevatedButton(
                                child: const Text('Delete'),
                                onPressed: () {
                                    status.value = "deleting-memo";
                                },
                            ),
                            const SizedBox(width: 20),
                            ElevatedButton(
                                child: const Text('Cancel'),
                                onPressed: () {
                                    Navigator.pop(context);
                                },
                            ),
                        ],
                    ),
                ],
            ),
        );
    }

    Widget deletingMemoWidget() {
        return FutureBuilder(
            future: Get.find<dependencies.AuthController>().deleteMemo(
                widget.index,
            ),
            builder: (context, snapshot) {
                if(snapshot.connectionState != ConnectionState.done) {
                    return const Center(
                        child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                                Text('Deleting Memo'),
                                SizedBox(height: 20),
                                CircularProgressIndicator(),
                                ],
                            ),
                         );
                       }  else if (snapshot.data == 'success') {
                        Future.delayed(
                            const Duration(seconds: 1),
                            () {
                                if(Get.find<dependencies.AuthController> ().memos.isNotEmpty) {
                                    widget.scrollToBottom();
                                }
                                Navigator.pop(context);
                            },
                        );
                        return const Center(
                        child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                                Text('Memo deleted successfully'),
                                SizedBox(height: 20),
                                CircularProgressIndicator(),
                                    ],
                                ),
                            );
                        } else {
                        return Center(
                        child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                                Text(snapshot.data!),
                                const SizedBox(height: 20),
                                ElevatedButton(
                                    child: const Text('Close'),
                                    onPressed: () {
                                        Navigator.pop(context);
                                    },
                                ),
                            ],
                        ),
                    );
                }
            },
        );
    }
    
    @override
    Widget build(BuildContext context) {
        return Scaffold(
            body: Obx(
                () => status.value == 'delete-memo' ?
                deleteMemoWidget() : status.value == 'deleting-memo'
                ? deletingMemoWidget() : const SizedBox(),
            ),
        );
    }
}