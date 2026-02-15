import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProjectsService } from '../modules/projects/projects.service';
import { TestsService } from '../modules/tests/tests.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const projectsService = app.get(ProjectsService);
  const testsService = app.get(TestsService);

  console.log('--- Workflow Seed Start ---');

  // 1️⃣ Создаём проект
  const project = await projectsService.create({
    name: 'Demo Project',
    description: 'Пример проекта для workflow',
    envs: {
      dev: { baseUrl: 'https://dev.example.com' },
      prod: { baseUrl: 'https://prod.example.com' },
    },
  });
  console.log('Created Project:', project._id, project.name);

  // 2️⃣ Создаём root-тест
  const rootTest = await testsService.create(project._id, null, {
    name: 'Root Test',
    description: 'Корневой тест',
    method: 'GET',
    urlPath: '/api/status',
    result: { code: 200 },
  });
  console.log('Created Root Test:', rootTest._id, rootTest.name);

  // 3️⃣ Создаём дочерние тесты
  const child1 = await testsService.create(project._id, rootTest._id, {
    name: 'Child Test 1',
    method: 'POST',
    urlPath: '/api/login',
    bodyType: 'json',
    body: { username: 'user1', password: 'pass1' },
    result: { code: 200 },
  });

  const child2 = await testsService.create(project._id, rootTest._id, {
    name: 'Child Test 2',
    method: 'GET',
    urlPath: '/api/profile',
    result: { code: 200 },
  });

  console.log('Created Child Tests:', child1._id, child2._id);

  // 4️⃣ Move child2 под child1
  const movedChild = await testsService.move(child2._id, child1._id);
  console.log(`Moved ${child2.name} under ${child1.name}`, movedChild.path);

  // 5️⃣ Получаем поддерево root
  const subtree = await testsService.getSubtree(rootTest._id);
  console.log('Subtree of Root Test:');
  subtree.forEach(t => console.log(t.name, 'path:', t.path));

  // 6️⃣ Soft delete child1
  await testsService.remove(child1._id);
  console.log('Soft deleted:', child1.name);

  const subtreeAfterDelete = await testsService.getSubtree(rootTest._id);
  console.log('Subtree after delete:');
  subtreeAfterDelete.forEach(t => console.log(t.name, 'deletedAt:', t.deletedAt));

  console.log('--- Workflow Seed End ---');

  await app.close();
}

bootstrap();